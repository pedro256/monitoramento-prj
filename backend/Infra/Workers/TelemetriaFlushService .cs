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
using backend.Infra.Realtime;
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

        private readonly IServiceProvider _serviceProvider;

        public TelemetriaFlushService(
            IConnectionMultiplexer redis,
            IConfiguration config,
            IServiceProvider serviceProvider
            )
        {
            _redis = redis.GetDatabase();
            _connString = config.GetConnectionString("DefaultConnection")!;
            _serviceProvider = serviceProvider;
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

            // 1. Atualiza os dispositivos que acabaram de chegar
            var batch = _redis.CreateBatch();
            foreach (var dev in payloads.Where(d => d != null))
            {
                batch.HashSetAsync(DevicesOnlineCachedKey, dev.DeviceId.ToString(), now.ToString("O"));
            }
            batch.Execute();

            var allDevices = await _redis.HashGetAllAsync(DevicesOnlineCachedKey);
            var devicesOnline = new List<string>();


            foreach (var entry in allDevices)
            {
                
                var deviceId = entry.Name.ToString();
                 devicesOnline.Add(deviceId);
                // if (DateTime.TryParse(entry.Value, out var lastSeen))
                // {
                //     if ((now - lastSeen) <= timeout)
                //     {
                //         devicesOnline.Add(deviceId);
                //     }
                //     else
                //     {
                //         await _redis.HashDeleteAsync(DevicesOnlineCachedKey, deviceId);
                //     }
                // }
            }

            using (var scope = _serviceProvider.CreateScope())
            {
                var devRepo = scope.ServiceProvider.GetRequiredService<DeviceRepository>();
                var realtimeNotifier = scope.ServiceProvider.GetRequiredService<IRealtimeNotifier>();
                var devicesOrg = await devRepo.GetDictOrganizationsByArrayDeviceId(devicesOnline);

                var grouped = devicesOnline
                    .Where(id => devicesOrg.ContainsKey(id)) // Evita erro se a chave não existir
                    .GroupBy(id => devicesOrg[id]);

                foreach (var group in grouped)
                {
                    await realtimeNotifier.SendToOrganization(group.Key, new
                    {
                        type = "devices_online",
                        value = group.Count(),
                        deviceIds = group.ToArray(),
                        at = DateTime.UtcNow
                    });
                }
            }



        }

        private async Task NotifyFlushEvents(List<DevicesPayload?> payloads)
        {
            using var scope = _serviceProvider.CreateScope();
            var devRepo = scope.ServiceProvider.GetRequiredService<DeviceRepository>();
            var realtimeNotifier = scope.ServiceProvider.GetRequiredService<IRealtimeNotifier>();

            var validPayloads = payloads.Where(p => p != null).Cast<DevicesPayload>().ToList();
            if (validPayloads.Count == 0) return;

            var deviceIds = validPayloads.Select(p => p.DeviceId.ToString()).Distinct().ToList();
            var devicesOrg = await devRepo.GetDictOrganizationsByArrayDeviceId(deviceIds);

            var byOrg = validPayloads
                .Where(p => devicesOrg.ContainsKey(p.DeviceId.ToString()))
                .GroupBy(p => devicesOrg[p.DeviceId.ToString()]);

            foreach (var group in byOrg)
            {
                var orgPayloads = group.ToList();
                var sensorsCount = orgPayloads.Sum(p => p.Sensors?.Count ?? 0);
                var alertsCount = orgPayloads.Sum(p => p.Alerts?.Count ?? 0);

                await realtimeNotifier.SendToOrganization(group.Key, new
                {
                    type = "telemetry_flush",
                    payloads = orgPayloads.Count,
                    sensors = sensorsCount,
                    alerts = alertsCount,
                    at = DateTime.UtcNow
                });

                foreach (var payload in orgPayloads)
                {
                    foreach (var alert in payload.Alerts ?? [])
                    {
                        await realtimeNotifier.SendToOrganization(group.Key, new
                        {
                            type = "alert",
                            deviceId = payload.DeviceId,
                            severity = alert.Severity,
                            message = alert.Description,
                            code = alert.Cod,
                            resolved = alert.Resolved,
                            at = payload.Timestamp
                        });
                    }
                }
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

                await using var conn = new NpgsqlConnection(_connString); // Move this to a using statement
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

                await NotifyFlushEvents(payloads);

                Console.WriteLine($"[Flush] {payloads.Count} payloads inseridos nas tabelas.");
            }
            catch (Exception e)
            {
                Console.WriteLine($"Erro Insert dados: {e.Message} {e.ToString()}.");
            }

        }

    }
}