using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StackExchange.Redis;
using Npgsql;
using System.Text.Json;
using backend.DTOs;
using NpgsqlTypes;

namespace backend.Infra.Workers
{
    public class TelemetriaFlushService : BackgroundService
    {
        private readonly IDatabase _redis;
        private readonly string _connString;
        private const string TelemetricBufferCachedKey = "mqtt:telemetria:buffer";
        private const string DevicesOnlineCachedKey = "devices-online-check";
        private const int IntervalMs = 5000;

        public TelemetriaFlushService(IConnectionMultiplexer redis, IConfiguration config)
        {
            _redis = redis.GetDatabase();
            _connString = config.GetConnectionString("DefaultConnection")!;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(IntervalMs, stoppingToken);
                await FlushAsync();
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

                //lista em cache de dispositivo (id,lastSeen)

                var _devicesCached = await _redis.ListRangeAsync(DevicesOnlineCachedKey);
                var devicesOnlineChecker = _devicesCached.Select(
                    x => JsonSerializer.Deserialize<DevicesOnlineChecker>(
                        x.ToString(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                        )
                    )
                    .Where(x => x != null)
                    .ToList();
                var now = DateTime.UtcNow;
                var timeout = TimeSpan.FromMinutes(1);
                var devicesDict = devicesOnlineChecker.ToDictionary(d => d.id, d => d);

                foreach (var dev in payloads)
                {
                    var id = dev.DeviceId.ToString();
                    if (!devicesDict.ContainsKey(id))
                    {
                        devicesDict[id] = new DevicesOnlineChecker
                        {
                            id = id,
                            lastSeen = now,
                            // companyId = dev.CompanyId // IMPORTANTE
                        };
                    }
                    else
                    {
                        devicesDict[id].lastSeen = now;
                    }
                }
                var devicesOnline = devicesDict
                    .Where(d => (now - d.Value.lastSeen) <= timeout)
                    .Select(d => d.Value)
                    .ToList();
                await _redis.KeyDeleteAsync(DevicesOnlineCachedKey);
                foreach (var device in devicesOnline)
                {
                    await _redis.ListRightPushAsync(
                        DevicesOnlineCachedKey,
                        JsonSerializer.Serialize(device)
                    );
                }
                // TODO: Adicionar ao Web Socket

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