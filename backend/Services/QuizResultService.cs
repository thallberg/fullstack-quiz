using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class QuizResultService : IQuizResultService
{
    private readonly IQuizResultRepository _quizResultRepository;
    private readonly IQuizRepository _quizRepository;
    private readonly IFriendshipService _friendshipService;

    public QuizResultService(
        IQuizResultRepository quizResultRepository,
        IQuizRepository quizRepository,
        IFriendshipService friendshipService)
    {
        _quizResultRepository = quizResultRepository;
        _quizRepository = quizRepository;
        _friendshipService = friendshipService;
    }

    public async Task SubmitQuizResultAsync(SubmitQuizResultDto resultDto, int userId)
    {
        // Validate QuizId
        if (resultDto.QuizId <= 0)
        {
            throw new InvalidOperationException("Invalid QuizId");
        }

        var quiz = await _quizRepository.GetByIdAsync(resultDto.QuizId);
        if (quiz == null)
        {
            throw new InvalidOperationException($"Quiz with id {resultDto.QuizId} not found");
        }

        // Validate quiz has questions
        var totalQuestions = quiz.Questions?.Count ?? 0;
        if (totalQuestions == 0)
        {
            throw new InvalidOperationException("Quiz has no questions");
        }

        // Ensure TotalQuestions matches actual quiz questions count
        var validatedTotalQuestions = resultDto.TotalQuestions > 0 ? resultDto.TotalQuestions : totalQuestions;
        
        // Recalculate percentage to ensure accuracy
        var validatedPercentage = validatedTotalQuestions > 0 
            ? (int)((resultDto.Score / (double)validatedTotalQuestions) * 100)
            : 0;

        var quizResult = new QuizResult
        {
            UserId = userId,
            QuizId = resultDto.QuizId,
            Score = resultDto.Score,
            TotalQuestions = validatedTotalQuestions,
            Percentage = validatedPercentage,
            CompletedAt = DateTime.UtcNow
        };

        await _quizResultRepository.CreateAsync(quizResult);
    }

    public async Task<LeaderboardDto> GetLeaderboardAsync(int userId)
    {
        // Get user's quizzes
        var myQuizzes = await _quizRepository.GetByUserIdAsync(userId);
        
        // Get user's friends
        var friends = await _friendshipService.GetFriendsAsync(userId);
        var friendIds = friends
            .Select(f => f.RequesterId == userId ? f.AddresseeId : f.RequesterId)
            .ToHashSet();
        
        // Get all quizzes to find friends' quizzes
        // Friends' quizzes: both private and public quizzes created by friends
        var allQuizzes = await _quizRepository.GetAllAsync();
        var friendsQuizzes = allQuizzes
            .Where(q => friendIds.Contains(q.UserId))
            .ToList();
        
        // Build leaderboard entries for my quizzes
        // Include quizzes even if they have no results yet
        var myQuizzesLeaderboard = new List<QuizLeaderboardEntryDto>();
        foreach (var quiz in myQuizzes)
        {
            var allResults = await _quizResultRepository.GetResultsByQuizIdAsync(quiz.Id);
            
            var resultsDto = allResults.Select(r => new QuizResultEntryDto
            {
                ResultId = r.Id,
                UserId = r.UserId,
                Username = r.User?.Username ?? "Unknown", // Handle null User gracefully
                Score = r.Score,
                TotalQuestions = r.TotalQuestions,
                Percentage = r.Percentage,
                CompletedAt = r.CompletedAt
            }).ToList();
            
            myQuizzesLeaderboard.Add(new QuizLeaderboardEntryDto
            {
                QuizId = quiz.Id,
                QuizTitle = quiz.Title,
                Results = resultsDto
            });
        }
        
        // Build leaderboard entries for friends' quizzes
        // Include quizzes even if they have no results yet
        var friendsQuizzesLeaderboard = new List<QuizLeaderboardEntryDto>();
        foreach (var quiz in friendsQuizzes)
        {
            var allResults = await _quizResultRepository.GetResultsByQuizIdAsync(quiz.Id);
            
            var resultsDto = allResults.Select(r => new QuizResultEntryDto
            {
                ResultId = r.Id,
                UserId = r.UserId,
                Username = r.User?.Username ?? "Unknown", // Handle null User gracefully
                Score = r.Score,
                TotalQuestions = r.TotalQuestions,
                Percentage = r.Percentage,
                CompletedAt = r.CompletedAt
            }).ToList();
            
            friendsQuizzesLeaderboard.Add(new QuizLeaderboardEntryDto
            {
                QuizId = quiz.Id,
                QuizTitle = quiz.Title,
                Results = resultsDto
            });
        }
        
        return new LeaderboardDto
        {
            MyQuizzes = myQuizzesLeaderboard,
            FriendsQuizzes = friendsQuizzesLeaderboard
        };
    }
}
