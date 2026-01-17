using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QuizResultController : ControllerBase
{
    private readonly IQuizResultService _quizResultService;

    public QuizResultController(IQuizResultService quizResultService)
    {
        _quizResultService = quizResultService;
    }

    [HttpPost]
    public async Task<ActionResult> SubmitResult([FromBody] SubmitQuizResultDto resultDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Invalid request data", errors = ModelState });
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            await _quizResultService.SubmitQuizResultAsync(resultDto, userId);
            return Ok(new { message = "Result saved successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Log unexpected errors
            return StatusCode(500, new { message = "An error occurred while saving the result", error = ex.Message });
        }
    }

    [HttpGet("leaderboard")]
    public async Task<ActionResult<LeaderboardDto>> GetLeaderboard()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized(new { message = "Invalid user" });
        }
        
        var leaderboard = await _quizResultService.GetLeaderboardAsync(userId);
        return Ok(leaderboard);
    }
}
