using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models;

namespace backend.Users.Models
{
    [Table("users")]
    public class UsersModel
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = "";

        [Required]
        [Column("email")]
        public string Email { get; set; } = "";

        [Column("password_hash")]
        public string PasswordHash { get; set; } = "";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        // RELACIONAMENTO
        public ICollection<OrganizationModel>? Organizations { get; set; }
    }
}