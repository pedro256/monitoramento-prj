using System.Security.Claims;
using backend.DTOs.Devices;
using backend.Models;
using backend.Repositories.Devices;
using backend.Repositories.Organization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize(AuthenticationSchemes = "Default")]
    [ApiController]
    [Route("api/organizations/{organizationId:guid}/devices")]
    public class DevicesController : ControllerBase
    {
        private readonly DeviceRepository _deviceRepository;
        private readonly OrganizationRepository _organizationRepository;

        public DevicesController(
            DeviceRepository deviceRepository,
            OrganizationRepository organizationRepository)
        {
            _deviceRepository = deviceRepository;
            _organizationRepository = organizationRepository;
        }

        [HttpGet]
        public async Task<IActionResult> List(Guid organizationId)
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized(new { error = "Não autorizado" });
            }

            if (!await _organizationRepository.UserHasAccess(userId, organizationId))
            {
                return NotFound(new { error = "Organização não encontrada" });
            }

            var devices = await _deviceRepository.GetByOrganizationAsync(organizationId);
            return Ok(devices.Select(ToDto));
        }

        [HttpPost]
        public async Task<IActionResult> Create(Guid organizationId, [FromBody] CreateDeviceRequest request)
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized(new { error = "Não autorizado" });
            }

            if (!await _organizationRepository.UserHasAccess(userId, organizationId))
            {
                return NotFound(new { error = "Organização não encontrada" });
            }

            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new { error = "Nome é obrigatório" });
            }

            var device = new DeviceModel
            {
                Id = Guid.NewGuid(),
                OrganizationId = organizationId,
                Name = request.Name,
                Model = request.Model,
                Location = request.Location,
                ApiToken = Guid.NewGuid(),
                Status = "offline",
                CreatedAt = DateTime.UtcNow,
            };

            await _deviceRepository.CreateAsync(device);
            return Ok(ToDto(device));
        }

        [HttpPatch]
        public async Task<IActionResult> Update(Guid organizationId, [FromBody] UpdateDeviceRequest request)
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized(new { error = "Não autorizado" });
            }

            if (!await _organizationRepository.UserHasAccess(userId, organizationId))
            {
                return NotFound(new { error = "Organização não encontrada" });
            }

            var device = await _deviceRepository.GetByIdAsync(request.Id);
            if (device == null || device.OrganizationId != organizationId)
            {
                return NotFound(new { error = "Device não encontrado" });
            }

            device.Name = request.Name;
            device.Model = request.Model;
            device.Location = request.Location;
            await _deviceRepository.UpdateAsync(device);

            return Ok(ToDto(device));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(Guid organizationId, [FromQuery] Guid id)
        {
            if (!TryGetUserId(out var userId))
            {
                return Unauthorized(new { error = "Não autorizado" });
            }

            if (!await _organizationRepository.UserHasAccess(userId, organizationId))
            {
                return NotFound(new { error = "Organização não encontrada" });
            }

            var device = await _deviceRepository.GetByIdAsync(id);
            if (device == null || device.OrganizationId != organizationId)
            {
                return NotFound(new { error = "Device não encontrado" });
            }

            await _deviceRepository.DeleteAsync(id);
            return Ok(new { success = true });
        }

        private static DeviceDto ToDto(DeviceModel device) => new()
        {
            Id = device.Id,
            OrganizationId = device.OrganizationId,
            Name = device.Name,
            Model = device.Model,
            Location = device.Location,
            ApiToken = device.ApiToken,
            Status = device.Status,
            LastHeartbeat = device.LastHeartbeat,
            CreatedAt = device.CreatedAt,
        };

        private bool TryGetUserId(out Guid userId)
        {
            var raw = User.FindFirst("sub")?.Value
                ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(raw, out userId);
        }
    }
}
