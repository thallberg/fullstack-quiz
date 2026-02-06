using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.RegisterAsync(registerDto);
        if (result == null)
        {
            return BadRequest(new { message = "Email already exists" });
        }

        // Set HttpOnly cookie with token (for web)
        SetAuthCookie(result.Token);

        // Return user data and token (token needed for mobile – cookies don't work in RN/Expo)
        return Ok(new
        {
            UserId = result.UserId,
            Username = result.Username,
            Email = result.Email,
            Token = result.Token
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.LoginAsync(loginDto);
        if (result == null)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        // Set HttpOnly cookie with token (for web)
        SetAuthCookie(result.Token);

        // Return user data and token (token needed for mobile)
        return Ok(new
        {
            UserId = result.UserId,
            Username = result.Username,
            Email = result.Email,
            Token = result.Token
        });
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<object>> GetProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized(new { message = "Invalid user" });
        }

        var usernameClaim = User.FindFirst(ClaimTypes.Name);
        var emailClaim = User.FindFirst(ClaimTypes.Email);

        return Ok(new
        {
            UserId = userId,
            Username = usernameClaim?.Value ?? string.Empty,
            Email = emailClaim?.Value ?? string.Empty
        });
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<ActionResult<AuthResponseDto>> UpdateProfile([FromBody] UpdateProfileDto updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized(new { message = "Invalid user" });
        }

        var result = await _authService.UpdateProfileAsync(userId, updateDto);
        if (result == null)
        {
            return BadRequest(new { message = "Email already exists or user not found" });
        }

        // Update cookie with new token (for web)
        SetAuthCookie(result.Token);

        // Return user data and token (for mobile)
        return Ok(new
        {
            UserId = result.UserId,
            Username = result.Username,
            Email = result.Email,
            Token = result.Token
        });
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized(new { message = "Invalid user" });
        }

        var success = await _authService.ChangePasswordAsync(userId, changePasswordDto);
        if (!success)
        {
            return BadRequest(new { message = "Invalid current password or user not found" });
        }

        return Ok(new { message = "Password changed successfully" });
    }

    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
        // Clear auth cookie
        Response.Cookies.Delete("authToken", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/"
        });

        return Ok(new { message = "Logged out successfully" });
    }

    private void SetAuthCookie(string token)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Cookies only over HTTPS
            SameSite = SameSiteMode.None, // Required for cross-site requests with credentials
            Path = "/",
            MaxAge = TimeSpan.FromDays(7) // Match JWT expiration
        };

        Response.Cookies.Append("authToken", token, cookieOptions);
    }
}
