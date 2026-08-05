using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    [Table("telemetric_alerts")]
    public class AlertModel
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("device_id")]
        public Guid? DeviceId { get; set; }

        [Required]
        [Column("severity")]
        public string Severity { get; set; } = ""; // info | warning | critical

        [Required]
        [Column("message")]
        public string Message { get; set; } = "";

        [Column("resolved")]
        public bool Resolved { get; set; } = false;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        // RELACIONAMENTO
        [ForeignKey(nameof(DeviceId))]
        public DeviceModel? Device { get; set; }
    }
}