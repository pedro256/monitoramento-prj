using backend.DTOs;
using MQTTnet;
using MQTTnet.Client;
using StackExchange.Redis;
using System.Text;
using System.Text.Json;

namespace backend.Services
{
    public class MqttConsumerDevicesService : BackgroundService
    {
        private IMqttClient _client;
        private readonly IDatabase _redis;
        private const string RedisKey = "mqtt:telemetria:buffer";

        public MqttConsumerDevicesService(IConnectionMultiplexer redis)
        {
            _redis = redis.GetDatabase();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var factory = new MqttFactory();
            _client = factory.CreateMqttClient();

            var options = new MqttClientOptionsBuilder()
                .WithTcpServer("localhost", 1883)
                .Build();

            _client.ApplicationMessageReceivedAsync += async e =>
            {
                var topic = e.ApplicationMessage.Topic;
                var partes = topic.Split('/');
                if (partes.Length < 4) return;
                var empresaId = partes[1];
                var deviceId = partes[2];
                //(FAZER VERIFICAÇÃO DE DISPOSITIVO)

                var payload = Encoding.UTF8.GetString(e.ApplicationMessage.PayloadSegment);
                await _redis.ListLeftPushAsync(RedisKey, payload);


            };
            await _client.ConnectAsync(options, stoppingToken);
            await _client.SubscribeAsync("empresa/+/+/telemetria");
            Console.WriteLine("MQTT conectado e inscrito!");
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}