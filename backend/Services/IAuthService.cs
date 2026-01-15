using backend.DTOs;

namespace backend.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
    Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto?> UpdateProfileAsync(int userId, UpdateProfileDto updateDto);
    Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto);
    string GenerateJwtToken(int userId, string username, string email);
}
