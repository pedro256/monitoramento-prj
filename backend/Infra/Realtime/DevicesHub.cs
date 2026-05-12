
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.Infra.Realtime
{
    [Authorize(AuthenticationSchemes = "Realtime")]
    public class DevicesHub : Hub
    {

            public async Task JoinOrganization(string organizationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, organizationId);
            Console.WriteLine($"Usuário conectou à organização: {organizationId}");
        }

        public async Task LeaveOrganization(string organizationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, organizationId);
        }

    }
}