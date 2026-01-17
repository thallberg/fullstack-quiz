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
            var bestResult = await _quizResultRepository.GetBestResultForQuizAsync(quiz.Id);
            var totalAttempts = await _quizResultRepository.GetTotalAttemptsForQuizAsync(quiz.Id);
            
            myQuizzesLeaderboard.Add(new QuizLeaderboardEntryDto
            {
                QuizId = quiz.Id,
                QuizTitle = quiz.Title,
                BestScore = bestResult?.Score,
                BestPercentage = bestResult?.Percentage,
                BestUsername = bestResult?.User?.Username,
                BestUserId = bestResult?.UserId,
                BestCompletedAt = bestResult?.CompletedAt,
                TotalAttempts = totalAttempts
            });
        }
        
        // Build leaderboard entries for friends' quizzes
        var friendsQuizzesLeaderboard = new List<QuizLeaderboardEntryDto>();
        foreach (var quiz in friendsQuizzes)
        {
            var bestResult = await _quizResultRepository.GetBestResultForQuizAsync(quiz.Id);
            var totalAttempts = await _quizResultRepository.GetTotalAttemptsForQuizAsync(quiz.Id);
            
            friendsQuizzesLeaderboard.Add(new QuizLeaderboardEntryDto
            {
                QuizId = quiz.Id,
                QuizTitle = quiz.Title,
                BestScore = bestResult?.Score,
                BestPercentage = bestResult?.Percentage,
                BestUsername = bestResult?.User?.Username,
                BestUserId = bestResult?.UserId,
                BestCompletedAt = bestResult?.CompletedAt,
                TotalAttempts = totalAttempts
            });
        }
        
        return new LeaderboardDto
        {
            MyQuizzes = myQuizzesLeaderboard,
            FriendsQuizzes = friendsQuizzesLeaderboard
        };
    }
}
