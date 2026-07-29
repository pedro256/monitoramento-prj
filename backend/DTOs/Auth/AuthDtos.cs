namespace backend.DTOs.Auth
{
    public class RegisterRequest
    {
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class LoginRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class AuthUserDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
    }

    public class AuthResponse
    {
        public string AccessToken { get; set; } = "";
        public long ExpiresAt { get; set; }
        public AuthUserDto User { get; set; } = new();
    }
}
