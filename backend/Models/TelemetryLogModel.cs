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
        [Column("id")]
        public long Id { get; set; }

        [Column("device_id")]
        public Guid? DeviceId { get; set; }

        [Column("cycle_count")]
        public int? CycleCount { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("tag")]
        public string Tag { get; set; } = "";

        [Column("value")]
        public decimal Value { get; set; }

        [Column("unity")]
        public string Unity { get; set; } = "";

        // RELACIONAMENTO
        [ForeignKey(nameof(DeviceId))]
        public DeviceModel? Device { get; set; }
    }
}