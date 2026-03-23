using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models;

namespace backend.Users.Models
{
    [Table("users")]
    public class UsersModel
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; } = "";

        [Required]
        public string Email { get; set; } = "";

        public DateTime CreatedAt { get; set; }

        // RELACIONAMENTO
        public ICollection<OrganizationModel>? Organizations { get; set; }
    }
}