using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace backend.Hubs
{
    public class RealtimeHub : Hub
    {
        public async Task JoinOrganization(string organizationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, organizationId);
        }

        public async Task LeaveOrganization(string organizationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, organizationId);
        }
    }
}