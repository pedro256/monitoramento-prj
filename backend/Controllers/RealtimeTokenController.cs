
using System.Security.Claims;
using backend.Repositories.Organization;
using backend.Services.RealtimeToken;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;



namespace backend.Controllers
{
    [Authorize(AuthenticationSchemes = "Default")]
    [ApiController]
    [Route("realtime-token")]
    public class RealtimeTokenController : ControllerBase
    {
        private readonly OrganizationRepository _orgRepository;
        private readonly IRealtimeTokenService _tokenServ;

        public RealtimeTokenController(OrganizationRepository orgRepository,IRealtimeTokenService tokenServ)
        {
            _orgRepository = orgRepository;
            _tokenServ = tokenServ;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] string organizationIdFromBody)
        {
            var userIdAuthenticated =
                User.FindFirst("sub")?.Value
                ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        

            if (userIdAuthenticated==null)
            {
                return BadRequest("Id Authenticado não encontrado !");
            }

            // if (!Guid.TryParse(userIdAuthenticated, out _) || !Guid.TryParse(organizationIdFromBody, out _))
            // {
            //     return BadRequest();
            // }
            // Guid userId = Guid.Parse(userIdAuthenticated);
            // Guid organizationId = Guid.Parse(organizationIdFromBody);

            // var hasAccess = await _orgRepository
            //     .UserHasAccess(userId, organizationId);

            // if (!hasAccess)
            //     return Unauthorized();

            var token = _tokenServ.Generate(userIdAuthenticated, organizationIdFromBody);

            return Ok(new { token });
        }
        
    }
}