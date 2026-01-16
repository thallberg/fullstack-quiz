using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using backend.Data;
using backend.Repositories;
using backend.Services;

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
        }
        else
        {
            // Use database repositories
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IQuizRepository, QuizRepository>();
        }

        // Add services
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IQuizService, QuizService>();
        builder.Services.AddScoped<IAuthService, AuthService>();

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
        });

        // Configure CORS
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                // Read allowed origins from configuration, default to localhost for development
                var allowedOrigins = builder.Configuration["Cors:AllowedOrigins"]?.Split(',') 
                    ?? new[] { "http://localhost:3000" };
                
                policy.WithOrigins(allowedOrigins)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        builder.Services.AddControllers();

        var app = builder.Build();

        // Use CORS before authentication/authorization
        app.UseCors("AllowFrontend");
        
        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}
