
using System.Text;
using backend.Contexts;
using backend.Repositories.Alert;
using backend.Repositories.Devices;
using backend.Repositories.Organization;
using backend.Repositories.TelemetryLog;
using backend.Repositories.Users;
using backend.Infra.Workers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;
using backend.Infra.Messaging;
using backend.Configuration;
using backend.Services.RealtimeToken;
using backend.Infra.Realtime;
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

            #region  CONFIGURE
            builder.Services.Configure<RealtimeJwtOptions>(
                builder.Configuration.GetSection("RealtimeJwt")
                );
            #endregion

            #region REDIS
            builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
            {
                var connString = builder.Configuration.GetConnectionString("Redis")!;
                return ConnectionMultiplexer.Connect(connString);
            });
            #endregion

            #region AUTH JWT
            var supabaseUrl = builder.Configuration["SupabaseStrings:Url"];
            string supabaseJwtSecret = builder.Configuration["SupabaseStrings:JwtSecret"] ?? "";

            string realtimeJwtSecret = builder.Configuration["RealtimeJwt:Key"] ?? "";



            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = "Default";
                options.DefaultChallengeScheme = "Default";
            })
            .AddJwtBearer("Default", options =>
            {
                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine($"[AUTH FAILED] {context.Exception.GetType().Name}: {context.Exception.Message}");
                        if (context.Exception.InnerException != null)
                            Console.WriteLine($"[INNER] {context.Exception.InnerException.Message}");
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = context =>
                    {
                        return Task.CompletedTask;
                    }
                };

                options.RequireHttpsMetadata = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKeyResolver = (token, securityToken, kid, parameters) =>
                    {
                        var client = new HttpClient();
                        var jwks = client.GetStringAsync(
                            supabaseUrl + "/auth/v1/.well-known/jwks.json"
                        ).Result;
                        var keys = new JsonWebKeySet(jwks);
                        return keys.GetSigningKeys();
                    },
                    ValidateIssuer = true,
                    ValidIssuer = supabaseUrl + "/auth/v1",
                    ValidateAudience = true,
                    ValidAudience = "authenticated",
                    ValidateLifetime = true,
                };
            })
            .AddJwtBearer("Realtime", options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(realtimeJwtSecret))
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;

                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/devicesHub"))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });


            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("RealtimePolicy", policy =>
                {
                    policy.AuthenticationSchemes.Add("Realtime");
                    policy.RequireAuthenticatedUser();
                });
            });
            #endregion


            #region  REPOSITORIES
            builder.Services.AddScoped<UsersRepository>();
            builder.Services.AddScoped<OrganizationRepository>();
            builder.Services.AddScoped<DeviceRepository>();
            builder.Services.AddScoped<AlertRepository>();
            builder.Services.AddScoped<TelemetryLogRepository>();
            #endregion


            #region WORKERS
            /**
            INICIA JUNTO COM A API, RODA EM BACKGROUND
            **/
            builder.Services.AddHostedService<MqttConsumerDevicesService>();
            builder.Services.AddHostedService<TelemetriaFlushService>();

            #endregion

            #region WEBSOCKET
            builder.Services.AddSignalR();
            #endregion

            #region SERVICES
            builder.Services.AddScoped<IRealtimeTokenService, RealtimeTokenService>();
            builder.Services.AddScoped<IRealtimeNotifier,RealtimeNotifier>();
            #endregion



        }
    }
}