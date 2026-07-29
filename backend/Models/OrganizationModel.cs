using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using backend.Users.Models;

namespace backend.Models
{
    [Table("organizations")]
    public class OrganizationModel
    {

        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = "";

        [Column("email")]
        public string? Email { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        // FK
        [Column("user_id")]
        public Guid? UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public UsersModel? User { get; set; }

        // RELACIONAMENTO
        public ICollection<DeviceModel>? Devices { get; set; }
    }
}