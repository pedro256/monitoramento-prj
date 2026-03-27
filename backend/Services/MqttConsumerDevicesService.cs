using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Protocol;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend.Services
{
    public class MqttConsumerDevicesService : BackgroundService
    {
        private IMqttClient _client;
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var factory = new MqttFactory();
            _client = factory.CreateMqttClient();

            var options = new MqttClientOptionsBuilder()
                .WithTcpServer("localhost", 1883)
                .Build();

            _client.ApplicationMessageReceivedAsync += async e =>
            {
                var payload = Encoding.UTF8.GetString(e.ApplicationMessage.PayloadSegment);

                Console.WriteLine($"Mensagem recebida: {payload}");
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