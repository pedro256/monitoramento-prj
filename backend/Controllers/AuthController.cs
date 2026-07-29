using System.Security.Claims;
using backend.DTOs.Auth;
using backend.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name)
                || string.IsNullOrWhiteSpace(request.Email)
                || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { error = "Nome, email e senha são obrigatórios" });
            }

            try
            {
                var response = await _authService.RegisterAsync(request);
                return Ok(new
                {
                    message = "Usuário criado",
                    accessToken = response.AccessToken,
                    expiresAt = response.ExpiresAt,
                    user = response.User,
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { error = "Email e senha são obrigatórios" });
            }

            var response = await _authService.LoginAsync(request);
            if (response == null)
            {
                return Unauthorized(new { error = "Email ou senha inválidos" });
            }

            return Ok(response);
        }

        [HttpGet("me")]
        [Authorize(AuthenticationSchemes = "Default")]
        public IActionResult Me()
        {
            var userId = User.FindFirst("sub")?.Value
                ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value
                ?? User.FindFirst("email")?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            return Ok(new
            {
                id = userId,
                email,
            });
        }
    }
}
