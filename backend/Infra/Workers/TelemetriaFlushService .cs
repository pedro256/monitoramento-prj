using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StackExchange.Redis;
using Npgsql;
using System.Text.Json;
using backend.DTOs;
using NpgsqlTypes;
using backend.Repositories.Organization;
using backend.Repositories.Devices;

namespace backend.Infra.Workers
{
    public class TelemetriaFlushService : BackgroundService
    {
        private readonly IDatabase _redis;
        private readonly string _connString;
        private const string TelemetricBufferCachedKey = "mqtt:telemetria:buffer";
        private const string DevicesOnlineCachedKey = "devices-online-check";
        private const int IntervalMs = 5000;

        private readonly DeviceRepository _devRepo;

        public TelemetriaFlushService(
            IConnectionMultiplexer redis,
            IConfiguration config,
            DeviceRepository deviceRepository
            )
        {
            _redis = redis.GetDatabase();
            _connString = config.GetConnectionString("DefaultConnection")!;
            _devRepo = deviceRepository;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(IntervalMs, stoppingToken);
                await FlushAsync();
            }
        }

        private async Task PersistOnlineDevices(List<DevicesPayload?>? payloads)
        {
            var now = DateTime.UtcNow;
            var timeout = TimeSpan.FromMinutes(1);

            var batch = _redis.CreateBatch();

            foreach (var dev in payloads)
            {
                var id = dev.DeviceId.ToString();

                batch.HashSetAsync(
                    DevicesOnlineCachedKey,
                    id,
                    now.ToString("O")
                );
            }

            batch.Execute();
            var allDevices = await _redis.HashGetAllAsync(DevicesOnlineCachedKey);

            var devicesOnline = new List<string>();

            foreach (var entry in allDevices)
            {
                var deviceId = entry.Name!;
                var lastSeen = DateTime.Parse(entry.Value!);

                if ((now - lastSeen) <= timeout)
                {
                    devicesOnline.Add(deviceId);
                }
                else
                {
                    await _redis.HashDeleteAsync(DevicesOnlineCachedKey, deviceId);
                }
            }

            // 🔥 3. busca org (ideal: cache isso!)
            var devicesOrg = await _devRepo
                .GetDictOrganizationsByArrayDeviceId(devicesOnline);


            var grouped = devicesOnline
                .GroupBy(id => devicesOrg[id]);

            foreach (var group in grouped)
            {
                // await _realtimeNotifier.SendToCompany(group.Key, new
                // {
                //     type = "devices_online",
                //     count = group.Count()
                // });
            }
        }
        private async Task FlushAsync()
        {
            try
            {
                var items = await _redis.ListRangeAsync(TelemetricBufferCachedKey);
                if (items.Length == 0) return;
                await _redis.KeyDeleteAsync(TelemetricBufferCachedKey);

                var payloads = items
                    .Select(x => JsonSerializer.Deserialize<DevicesPayload>(x.ToString(),
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true }))
                    .Where(x => x != null)
                    .ToList();

                await using var conn = new NpgsqlConnection(_connString);
                await conn.OpenAsync();

                await PersistOnlineDevices(payloads);


                // Sensores em massa
                await using (var writer = await conn.BeginBinaryImportAsync(
                    "COPY telemetry_logs (device_id, cycle_count, created_at, tag, value, unity) FROM STDIN (FORMAT BINARY)"))
                {
                    foreach (var p in payloads)
                        foreach (var s in p!.Sensors)
                        {
                            await writer.StartRowAsync();
                            // await writer.WriteAsync(p.EmpresaId, NpgsqlDbType.Text);
                            await writer.WriteAsync(p.DeviceId, NpgsqlDbType.Uuid);
                            await writer.WriteAsync(0, NpgsqlDbType.Integer);
                            await writer.WriteAsync(p.Timestamp, NpgsqlDbType.TimestampTz);
                            await writer.WriteAsync(s.Tag, NpgsqlDbType.Varchar);
                            await writer.WriteAsync(s.Value, NpgsqlDbType.Numeric);
                            await writer.WriteAsync(s.Unity, NpgsqlDbType.Varchar);

                        }
                    await writer.CompleteAsync();
                }


                // Alarmes
                await using (var writer = await conn.BeginBinaryImportAsync(
                    "COPY telemetric_alerts (device_id, severity, message, resolved, created_at) FROM STDIN (FORMAT BINARY)"))
                {
                    foreach (var p in payloads)
                        foreach (var a in p!.Alerts)
                        {
                            await writer.StartRowAsync();
                            await writer.WriteAsync(p.DeviceId, NpgsqlDbType.Uuid);
                            await writer.WriteAsync(a.Severity, NpgsqlDbType.Text);
                            await writer.WriteAsync(a.Description, NpgsqlDbType.Text);
                            await writer.WriteAsync(a.Resolved, NpgsqlDbType.Boolean);
                            await writer.WriteAsync(p.Timestamp, NpgsqlDbType.TimestampTz);
                        }
                    await writer.CompleteAsync();
                }

                Console.WriteLine($"[Flush] {payloads.Count} payloads inseridos nas tabelas.");
            }
            catch (Exception e)
            {
                Console.WriteLine($"Erro Insert dados: {e.Message} {e.ToString()}.");
            }

        }

    }
}