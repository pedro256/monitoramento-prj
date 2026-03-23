using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    [Table("device")]
    public class DeviceModel
    {
        [Key]
        public Guid Id { get; set; }

        public Guid? OrganizationId { get; set; }

        [Required]
        public string Name { get; set; } = "";

        public string? Model { get; set; }
        public string? Location { get; set; }

        public Guid ApiToken { get; set; }

        public string Status { get; set; } = "offline";

        public DateTime? LastHeartbeat { get; set; }

        public string Settings { get; set; } = "{}"; // jsonb

        public DateTime CreatedAt { get; set; }

        // RELACIONAMENTO
        [ForeignKey(nameof(OrganizationId))]
        public OrganizationModel? Organization { get; set; }

        public ICollection<AlertModel>? Alerts { get; set; }
        public ICollection<TelemetryLogModel>? TelemetryLogs { get; set; }
    }
}