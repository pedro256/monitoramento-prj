using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Repositories.Base;
using backend.Repositories.Organization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.Infra.Realtime
{
    [Authorize(AuthenticationSchemes = "Realtime")]
    public class DevicesHub : Hub
    {
        private readonly OrganizationRepository _orgRepository;

        public DevicesHub(OrganizationRepository orgRepository)
        {
            _orgRepository = orgRepository;
        }

        public override async Task OnConnectedAsync()
        {
            var userIdClaim = Context.User?.FindFirst("sub")?.Value;
            var orgIdClaim = Context.User?.FindFirst("org")?.Value;
            if (!Guid.TryParse(userIdClaim, out _) || !Guid.TryParse(orgIdClaim, out _))
            {
                Context.Abort();
                return;
            }
            Guid userId = Guid.Parse(userIdClaim);
            Guid organizationId = Guid.Parse(orgIdClaim);

            var hasAccess = await _orgRepository
                .UserHasAccess(userId, organizationId);

            if (!hasAccess)
            {
                Context.Abort();
                return;
            }


            await Groups.AddToGroupAsync(Context.ConnectionId,orgIdClaim);

            await base.OnConnectedAsync();
        }
    }
}