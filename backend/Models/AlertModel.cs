using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    [Table("alert")]
    public class AlertModel
    {
        [Key]
        public Guid Id { get; set; }

        public Guid? DeviceId { get; set; }

        [Required]
        public string Severity { get; set; } = ""; // info | warning | critical

        [Required]
        public string Message { get; set; } = "";

        public bool Resolved { get; set; } = false;

        public DateTime CreatedAt { get; set; }

        // RELACIONAMENTO
        [ForeignKey(nameof(DeviceId))]
        public DeviceModel? Device { get; set; }
    }
}