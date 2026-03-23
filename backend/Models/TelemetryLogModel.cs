using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    [Table("telemetry_logs")]
    public class TelemetryLogModel
    {
        [Key]
        public long Id { get; set; }

        public Guid? DeviceId { get; set; }

        [Required]
        public string Payload { get; set; } = "{}"; // jsonb

        public decimal? Temperature { get; set; }
        public decimal? Pressure { get; set; }
        public int? CycleCount { get; set; }

        public DateTime CreatedAt { get; set; }

        // RELACIONAMENTO
        [ForeignKey(nameof(DeviceId))]
        public DeviceModel? Device { get; set; }
    }
}