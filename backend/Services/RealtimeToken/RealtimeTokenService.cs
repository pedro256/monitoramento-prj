using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Configuration;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

namespace backend.Services.RealtimeToken
{
    public class RealtimeTokenService : IRealtimeTokenService
    {
        private readonly string _key;

        public RealtimeTokenService(IOptions<RealtimeJwtOptions> options)
        {
            _key = options.Value.Key;
        }

        public string Generate(string userId, string orgId)
        {
            var claims = new[]
            {
            new Claim("sub", userId),
            new Claim("org", orgId),
            new Claim("scope", "realtime")
        };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_key));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}