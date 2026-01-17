using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QuizController : ControllerBase
{
    private readonly IQuizService _quizService;

    public QuizController(IQuizService quizService)
    {
        _quizService = quizService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<object>> GetAllQuizzes()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        
        // If user is authenticated, return grouped quizzes
        if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
        {
            var groupedQuizzes = await _quizService.GetGroupedQuizzesAsync(userId);
            return Ok(groupedQuizzes);
        }
        
        // If anonymous, only return public quizzes
        var quizzes = await _quizService.GetAllQuizzesAsync();
        var publicQuizzes = quizzes.Where(q => q.IsPublic).ToList();
        return Ok(new { MyQuizzes = new List<QuizResponseDto>(), FriendsQuizzes = new List<QuizResponseDto>(), PublicQuizzes = publicQuizzes });
    }

    [HttpGet("my-quizzes")]
    public async Task<ActionResult<IEnumerable<QuizResponseDto>>> GetMyQuizzes()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized(new { message = "Invalid user" });
        }

        var quizzes = await _quizService.GetQuizzesByUserIdAsync(userId);
        return Ok(quizzes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<QuizResponseDto>> GetQuizById(int id)
    {
        var quiz = await _quizService.GetQuizByIdAsync(id);
        if (quiz == null)
        {
            return NotFound(new { message = "Quiz not found" });
        }

        return Ok(quiz);
    }

    [HttpPost]
    public async Task<ActionResult<QuizResponseDto>> CreateQuiz([FromBody] CreateQuizDto createQuizDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var createdQuiz = await _quizService.CreateQuizAsync(createQuizDto, userId);

        return CreatedAtAction(nameof(GetQuizById), new { id = createdQuiz.Id }, createdQuiz);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<QuizResponseDto>> UpdateQuiz(int id, [FromBody] CreateQuizDto updateQuizDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var updatedQuiz = await _quizService.UpdateQuizAsync(id, updateQuizDto, userId);
            if (updatedQuiz == null)
            {
                return NotFound(new { message = "Quiz not found" });
            }

            return Ok(updatedQuiz);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("{id}/play")]
    [AllowAnonymous]
    public async Task<ActionResult<PlayQuizDto>> PlayQuiz(int id)
    {
        var quiz = await _quizService.GetQuizByIdAsync(id);
        if (quiz == null)
            return NotFound();

        var playQuiz = new PlayQuizDto
        {
            Id = quiz.Id,
            Title = quiz.Title,
            Questions = quiz.Questions.Select(q => new PlayQuestionDto
            {
                Id = q.Id,
                Text = q.Text
            }).ToList()
        };

        return Ok(playQuiz);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuiz(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        try
        {
            var deleted = await _quizService.DeleteQuizAsync(id, userId);
            if (!deleted)
            {
                return NotFound(new { message = "Quiz not found" });
            }

            return NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

}
