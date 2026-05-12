using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    [Table("devices")]
    public class DeviceModel
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }
        [Column("organization_id")]
        public Guid OrganizationId { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = "";

        [Column("model")]
        public string? Model { get; set; }
        [Column("location")]
        public string? Location { get; set; }
        [Column("api_token")]
        public Guid ApiToken { get; set; }
        [Column("_status")]
        public string Status { get; set; } = "offline";
        [Column("last_heartbeat")]
        public DateTime? LastHeartbeat { get; set; }
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        // RELACIONAMENTO
        [ForeignKey(nameof(OrganizationId))]
        public OrganizationModel? Organization { get; set; }

        public ICollection<AlertModel>? Alerts { get; set; }
        public ICollection<TelemetryLogModel>? TelemetryLogs { get; set; }
    }
}