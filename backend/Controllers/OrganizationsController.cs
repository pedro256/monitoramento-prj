using System.Security.Claims;
using backend.DTOs.Organizations;
using backend.Models;
using backend.Repositories.Organization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize(AuthenticationSchemes = "Default")]
    [ApiController]
    [Route("api/organizations")]
    public class OrganizationsController : ControllerBase
    {
        private readonly OrganizationRepository _organizationRepository;

        public OrganizationsController(OrganizationRepository organizationRepository)
        {
            _organizationRepository = organizationRepository;
        }

        [HttpGet]
        public async Task<IActionResult> List()
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized(new { error = "Não autorizado" });
            }

            var orgs = await _organizationRepository.GetByUserAsync(userId);
            var response = orgs.Select(o => new OrganizationDto
            {
                Id = o.Id,
                Name = o.Name,
                Email = o.Email,
            });

            return Ok(response);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized(new { error = "Não autorizado" });
            }

            var hasAccess = await _organizationRepository.UserHasAccess(userId, id);
            if (!hasAccess)
            {
                return NotFound(new { error = "Organização não encontrada" });
            }

            var org = await _organizationRepository.GetByIdAsync(id);
            if (org == null)
            {
                return NotFound(new { error = "Organização não encontrada" });
            }

            return Ok(new OrganizationDto
            {
                Id = org.Id,
                Name = org.Name,
                Email = org.Email,
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrganizationRequest request)
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized(new { error = "Não autorizado" });
            }

            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new { error = "Nome é obrigatório" });
            }

            var org = new OrganizationModel
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
            };

            await _organizationRepository.CreateAsync(org);

            return Ok(new OrganizationDto
            {
                Id = org.Id,
                Name = org.Name,
                Email = org.Email,
            });
        }

        private bool TryGetUserId(out Guid userId)
        {
            var raw = User.FindFirst("sub")?.Value
                ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(raw, out userId);
        }
    }
}
