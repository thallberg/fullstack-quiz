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
        var quiz = await _quizRepository.GetByIdAsync(resultDto.QuizId);
        if (quiz == null)
        {
            throw new InvalidOperationException("Quiz not found");
        }

        var quizResult = new QuizResult
        {
            UserId = userId,
            QuizId = resultDto.QuizId,
            Score = resultDto.Score,
            TotalQuestions = resultDto.TotalQuestions,
            Percentage = resultDto.Percentage,
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
        var allQuizzes = await _quizRepository.GetAllAsync();
        var friendsQuizzes = allQuizzes
            .Where(q => friendIds.Contains(q.UserId) && !q.IsPublic)
            .ToList();
        
        // Build leaderboard entries for my quizzes
        var myQuizzesLeaderboard = new List<QuizLeaderboardEntryDto>();
        foreach (var quiz in myQuizzes)
        {
            var allResults = await _quizResultRepository.GetResultsByQuizIdAsync(quiz.Id);
            
            var resultsDto = allResults.Select(r => new QuizResultEntryDto
            {
                ResultId = r.Id,
                UserId = r.UserId,
                Username = r.User.Username,
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
        var friendsQuizzesLeaderboard = new List<QuizLeaderboardEntryDto>();
        foreach (var quiz in friendsQuizzes)
        {
            var allResults = await _quizResultRepository.GetResultsByQuizIdAsync(quiz.Id);
            
            var resultsDto = allResults.Select(r => new QuizResultEntryDto
            {
                ResultId = r.Id,
                UserId = r.UserId,
                Username = r.User.Username,
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
