using System.Linq;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using backend.Data;
using backend.Repositories;
using backend.Services;
using backend.Models;

namespace backend;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Storage configuration - Change "Storage:Type" in appsettings.json to "Database" or "Memory"
        var storageType = builder.Configuration["Storage:Type"] ?? "Database";

        if (storageType.Equals("Memory", StringComparison.OrdinalIgnoreCase))
        {
            // Use in-memory repositories
            builder.Services.AddScoped<IUserRepository, InMemoryUserRepository>();
            // InMemoryQuizRepository needs IUserRepository to load navigation properties
            builder.Services.AddScoped<IQuizRepository>(sp => 
                new InMemoryQuizRepository(sp.GetRequiredService<IUserRepository>()));
            // InMemoryFriendshipRepository needs IUserRepository to load navigation properties
            builder.Services.AddScoped<IFriendshipRepository>(sp => 
                new InMemoryFriendshipRepository(sp.GetRequiredService<IUserRepository>()));
            builder.Services.AddScoped<IQuizResultRepository, InMemoryQuizResultRepository>();
        }
        else
        {
            // Use database repositories
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IQuizRepository, QuizRepository>();
            builder.Services.AddScoped<IFriendshipRepository, FriendshipRepository>();
            builder.Services.AddScoped<IQuizResultRepository, QuizResultRepository>();
        }

        // Add services
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IQuizService, QuizService>();
        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<IFriendshipService, FriendshipService>();
        builder.Services.AddScoped<IQuizResultService, QuizResultService>();

        // Configure JWT Authentication
        var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
        var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer not configured");
        var jwtAudience = builder.Configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience not configured");

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
            };

            // Read token from cookie if Authorization header is missing
            options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    // If no token in Authorization header, try to get it from cookie
                    if (string.IsNullOrEmpty(context.Token))
                    {
                        context.Token = context.Request.Cookies["authToken"];
                    }
                    return Task.CompletedTask;
                }
            };
        });

        // Configure CORS
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                // Read allowed origins from configuration, default to localhost for development
                var corsOrigins = builder.Configuration["Cors:AllowedOrigins"] ?? string.Empty;
                var allowedOrigins = corsOrigins
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .Where(o => !string.IsNullOrWhiteSpace(o))
                    .ToArray();

                if (allowedOrigins.Length == 0)
                {
                    // Default to localhost for development
                    allowedOrigins = new[] { "http://localhost:3000", "https://localhost:3000" };
                }
                
                policy.WithOrigins(allowedOrigins)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials() // Required for cookies
                      .SetPreflightMaxAge(TimeSpan.FromHours(1)); // Cache preflight for 1 hour
            });
        });

        builder.Services.AddControllers();

        var app = builder.Build();

        // CORS MUST be first, even before UseRouting for preflight requests
        app.UseCors("AllowFrontend");

        app.UseRouting();

        // Security headers middleware
        app.Use(async (context, next) =>
        {
            context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
            context.Response.Headers.Append("X-Frame-Options", "DENY");
            context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
            context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
            
            // HSTS - Only in production (HTTPS)
            if (app.Environment.IsProduction() && context.Request.IsHttps)
            {
                context.Response.Headers.Append("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
            }
            
            await next();
        });
        
        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}
