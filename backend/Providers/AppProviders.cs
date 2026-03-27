
using System.Text;
using backend.Contexts;
using backend.Repositories.Alert;
using backend.Repositories.Devices;
using backend.Repositories.Organization;
using backend.Repositories.TelemetryLog;
using backend.Repositories.Users;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend.Providers
{
    public class AppProviders
    {
        public static void Config(WebApplicationBuilder builder)
        {
            #region CONTEXT
            builder.Services.AddDbContext<AppPgDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
            );
            #endregion

            #region AUTH JWT
            var supabaseUrl = builder.Configuration["SupabaseStrings:Url"];
            string supabaseJwtSecret = builder.Configuration["SupabaseStrings:JwtSecret"] ?? "";

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = supabaseUrl,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(supabaseJwtSecret)
                    )
                };
            });
            builder.Services.AddAuthorization();
            #endregion
            

            #region  REPOSITORIES
            builder.Services.AddScoped<UsersRepository>();
            builder.Services.AddScoped<OrganizationRepository>();
            builder.Services.AddScoped<DeviceRepository>();
            builder.Services.AddScoped<AlertRepository>();
            builder.Services.AddScoped<TelemetryLogRepository>();
            #endregion


            #region SERVICES
            /**
            INICIA JUNTO COM A API, RODA EM BACKGROUND
            **/
            builder.Services.AddHostedService<MqttConsumerDevicesService>();
            #endregion


        }
    }
}