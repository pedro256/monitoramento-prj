using System.Security.Claims;
using backend.DTOs.Devices;
using backend.Models;
using backend.Repositories.Alert;
using backend.Repositories.Devices;
using backend.Repositories.Organization;
using backend.Repositories.TelemetryLog;
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
        private readonly AlertRepository _alertRepository;
        private readonly TelemetryLogRepository _telemetryLogRepository;

        public DevicesController(
            DeviceRepository deviceRepository,
            OrganizationRepository organizationRepository,
            AlertRepository alertRepository,
            TelemetryLogRepository telemetryLogRepository)
        {
            _deviceRepository = deviceRepository;
            _organizationRepository = organizationRepository;
            _alertRepository = alertRepository;
            _telemetryLogRepository = telemetryLogRepository;
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

        [HttpGet("{deviceId:guid}")]
        public async Task<IActionResult> GetById(Guid organizationId, Guid deviceId)
        {
            var access = await EnsureDeviceAccess(organizationId, deviceId);
            if (access.Error != null)
            {
                return access.Error;
            }

            return Ok(ToDto(access.Device!));
        }

        [HttpGet("{deviceId:guid}/alerts")]
        public async Task<IActionResult> GetAlerts(
            Guid organizationId,
            Guid deviceId,
            [FromQuery] int limit = 50)
        {
            var access = await EnsureDeviceAccess(organizationId, deviceId);
            if (access.Error != null)
            {
                return access.Error;
            }

            var alerts = await _alertRepository.GetByDeviceAsync(deviceId, Math.Clamp(limit, 1, 200));
            var response = alerts.Select(a => new TelemetryAlertDto
            {
                Id = a.Id,
                DeviceId = a.DeviceId,
                Severity = a.Severity,
                Message = a.Message,
                Resolved = a.Resolved,
                CreatedAt = a.CreatedAt,
            });

            return Ok(response);
        }

        [HttpGet("{deviceId:guid}/telemetry")]
        public async Task<IActionResult> GetTelemetry(
            Guid organizationId,
            Guid deviceId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            var access = await EnsureDeviceAccess(organizationId, deviceId);
            if (access.Error != null)
            {
                return access.Error;
            }

            page = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 200);

            var logs = await _telemetryLogRepository.GetByDeviceAsync(deviceId, page, pageSize);
            var response = logs.Select(t => new TelemetryLogDto
            {
                Id = t.Id,
                DeviceId = t.DeviceId,
                CycleCount = t.CycleCount,
                Tag = t.Tag,
                Value = t.Value,
                Unity = t.Unity,
                CreatedAt = t.CreatedAt,
            });

            return Ok(response);
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

        private async Task<(DeviceModel? Device, IActionResult? Error)> EnsureDeviceAccess(
            Guid organizationId,
            Guid deviceId)
        {
            if (!TryGetUserId(out var userId))
            {
                return (null, Unauthorized(new { error = "Não autorizado" }));
            }

            if (!await _organizationRepository.UserHasAccess(userId, organizationId))
            {
                return (null, NotFound(new { error = "Organização não encontrada" }));
            }

            var device = await _deviceRepository.GetByIdAsync(deviceId);
            if (device == null || device.OrganizationId != organizationId)
            {
                return (null, NotFound(new { error = "Device não encontrado" }));
            }

            return (device, null);
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
