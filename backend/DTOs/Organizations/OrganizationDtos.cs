namespace backend.DTOs.Organizations
{
    public class OrganizationDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public string? Email { get; set; }
    }

    public class CreateOrganizationRequest
    {
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
    }
}
