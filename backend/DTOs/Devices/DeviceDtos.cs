namespace backend.DTOs.Devices
{
    public class DeviceDto
    {
        public Guid Id { get; set; }
        public Guid OrganizationId { get; set; }
        public string Name { get; set; } = "";
        public string? Model { get; set; }
        public string? Location { get; set; }
        public Guid ApiToken { get; set; }
        public string Status { get; set; } = "offline";
        public DateTime? LastHeartbeat { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateDeviceRequest
    {
        public string Name { get; set; } = "";
        public string? Model { get; set; }
        public string? Location { get; set; }
    }

    public class UpdateDeviceRequest
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public string? Model { get; set; }
        public string? Location { get; set; }
    }

    public class TelemetryAlertDto
    {
        public Guid Id { get; set; }
        public Guid? DeviceId { get; set; }
        public string Severity { get; set; } = "";
        public string Message { get; set; } = "";
        public bool Resolved { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class TelemetryLogDto
    {
        public long Id { get; set; }
        public Guid? DeviceId { get; set; }
        public int? CycleCount { get; set; }
        public string Tag { get; set; } = "";
        public decimal Value { get; set; }
        public string Unity { get; set; } = "";
        public DateTime CreatedAt { get; set; }
    }
}
