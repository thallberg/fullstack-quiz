using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
    {
        // Check if user already exists
        var existingUser = await _userRepository.GetByEmailAsync(registerDto.Email);
        if (existingUser != null)
        {
            return null; // User already exists
        }

        // Hash password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

        // Create new user
        var user = new User
        {
            Username = registerDto.Username,
            Email = registerDto.Email,
            PasswordHash = passwordHash
        };

        var createdUser = await _userRepository.CreateAsync(user);

        // Generate JWT token
        var token = GenerateJwtToken(createdUser.Id, createdUser.Username, createdUser.Email);

        return new AuthResponseDto
        {
            Token = token,
            UserId = createdUser.Id,
            Username = createdUser.Username,
            Email = createdUser.Email
        };
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
    {
        var user = await _userRepository.GetByEmailAsync(loginDto.Email);
        if (user == null)
        {
            return null; // User not found
        }

        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return null; // Invalid password
        }

        // Generate JWT token
        var token = GenerateJwtToken(user.Id, user.Username, user.Email);

        return new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email
        };
    }

    public async Task<AuthResponseDto?> UpdateProfileAsync(int userId, UpdateProfileDto updateDto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return null; // User not found
        }

        // Check if email is already taken by another user
        var existingUser = await _userRepository.GetByEmailAsync(updateDto.Email);
        if (existingUser != null && existingUser.Id != userId)
        {
            return null; // Email already exists
        }

        // Update user info
        user.Username = updateDto.Username;
        user.Email = updateDto.Email;

        await _userRepository.UpdateAsync(user);

        // Generate new JWT token with updated info
        var token = GenerateJwtToken(user.Id, user.Username, user.Email);

        return new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email
        };
    }

    public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return false; // User not found
        }

        // Verify current password
        if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.PasswordHash))
        {
            return false; // Invalid current password
        }

        // Hash new password
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
        await _userRepository.UpdateAsync(user);

        return true;
    }

    public string GenerateJwtToken(int userId, string username, string email)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured")));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Email, email)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
