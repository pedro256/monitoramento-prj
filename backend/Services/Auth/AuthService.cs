using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Configuration;
using backend.DTOs.Auth;
using backend.Repositories.Users;
using backend.Users.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services.Auth
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse?> LoginAsync(LoginRequest request);
    }

    public class AuthService : IAuthService
    {
        private readonly UsersRepository _usersRepository;
        private readonly AuthJwtOptions _authJwt;
        private const int AccessTokenTtlSeconds = 60 * 60;

        public AuthService(UsersRepository usersRepository, IOptions<AuthJwtOptions> authJwt)
        {
            _usersRepository = usersRepository;
            _authJwt = authJwt.Value;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            var existing = await _usersRepository.GetByEmailAsync(request.Email);
            if (existing != null)
            {
                throw new InvalidOperationException("Email já cadastrado");
            }

            var user = new UsersModel
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow,
            };

            await _usersRepository.CreateAsync(user);
            return CreateAuthResponse(user);
        }

        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _usersRepository.GetByEmailAsync(request.Email);
            if (user == null || string.IsNullOrWhiteSpace(user.PasswordHash))
            {
                return null;
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return null;
            }

            return CreateAuthResponse(user);
        }

        private AuthResponse CreateAuthResponse(UsersModel user)
        {
            var expiresAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds() + AccessTokenTtlSeconds;
            var token = GenerateAccessToken(user, expiresAt);

            return new AuthResponse
            {
                AccessToken = token,
                ExpiresAt = expiresAt,
                User = new AuthUserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                },
            };
        }

        private string GenerateAccessToken(UsersModel user, long expiresAtUnix)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authJwt.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new(JwtRegisteredClaimNames.Email, user.Email),
                new("role", "authenticated"),
            };

            var token = new JwtSecurityToken(
                issuer: _authJwt.Issuer,
                audience: _authJwt.Audience,
                claims: claims,
                expires: DateTimeOffset.FromUnixTimeSeconds(expiresAtUnix).UtcDateTime,
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
