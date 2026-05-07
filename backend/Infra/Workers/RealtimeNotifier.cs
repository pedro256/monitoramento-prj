using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using backend.Hubs;

namespace backend.Infra.Realtime
{
    public class RealtimeNotifier : IRealtimeNotifier
    {
        private readonly IHubContext<RealtimeHub> _hubContext;

        public RealtimeNotifier(IHubContext<RealtimeHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendToOrganization(string organizationId, object message)
        {
            // Dispara um evento WebSocket na via "ReceiveMessage" apenas para o grupo correto
            await _hubContext.Clients.Group(organizationId).SendAsync("ReceiveMessage", message);
        }
    }
}