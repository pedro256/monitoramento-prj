using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using backend.Users.Models;

namespace backend.Models
{
    [Table("organization")]
    public class OrganizationModel
    {

        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; } = "";

        public string? Email { get; set; }

        public DateTime CreatedAt { get; set; }

        // FK
        public Guid? UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public UsersModel? User { get; set; }

        // RELACIONAMENTO
        public ICollection<DeviceModel>? Devices { get; set; }
    }
}