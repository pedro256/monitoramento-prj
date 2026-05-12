using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace backend.Infra.Realtime
{
    public class RealtimeNotifier : IRealtimeNotifier
    {
        private readonly IHubContext<DevicesHub> _hubContext;

        public RealtimeNotifier(IHubContext<DevicesHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendToOrganization(string organizationId, object message)
        {
            await _hubContext.Clients.Group(organizationId).SendAsync("ReceiveMessage", message);
        }
    }
}