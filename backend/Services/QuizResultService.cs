using System.Linq;
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

        var canAccess = await CanUserAccessQuizAsync(userId, quiz);
        if (!canAccess)
        {
            throw new InvalidOperationException("You do not have access to this quiz");
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
        
        // Get all quizzes to find friends' quizzes and public quizzes
        // Friends' quizzes: both private and public quizzes created by friends
        var allQuizzes = await _quizRepository.GetAllAsync();
        var friendsQuizzes = allQuizzes
            .Where(q => friendIds.Contains(q.UserId))
            .ToList();
        
        // Public quizzes: public quizzes NOT created by user or friends
        var myQuizIds = myQuizzes.Select(q => q.Id).ToHashSet();
        var friendsQuizIds = friendsQuizzes.Select(q => q.Id).ToHashSet();
        var publicQuizzes = allQuizzes
            .Where(q => q.IsPublic && !myQuizIds.Contains(q.Id) && !friendsQuizIds.Contains(q.Id))
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
                Results = resultsDto.Take(5).ToList() // Only show top 5 results
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
                Results = resultsDto.Take(5).ToList() // Only show top 5 results
            });
        }
        
        // Build leaderboard entries for public quizzes
        var publicQuizzesLeaderboard = new List<QuizLeaderboardEntryDto>();
        foreach (var quiz in publicQuizzes)
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
            
            publicQuizzesLeaderboard.Add(new QuizLeaderboardEntryDto
            {
                QuizId = quiz.Id,
                QuizTitle = quiz.Title,
                Results = resultsDto.Take(5).ToList() // Only show top 5 results
            });
        }
        
        return new LeaderboardDto
        {
            MyQuizzes = myQuizzesLeaderboard,
            FriendsQuizzes = friendsQuizzesLeaderboard,
            PublicQuizzes = publicQuizzesLeaderboard
        };
    }

    public async Task<MyLeaderboardDto> GetMyLeaderboardAsync(int userId)
    {
        // Get all results for the user
        var userResults = await _quizResultRepository.GetResultsByUserIdAsync(userId);
        
        // Group results by quiz and get top 3 per quiz
        var groupedResults = userResults
            .GroupBy(r => r.QuizId)
            .Select(g => new
            {
                QuizId = g.Key,
                Quiz = g.First().Quiz,
                TopResults = g
                    .OrderByDescending(r => r.Percentage)
                    .ThenByDescending(r => r.CompletedAt)
                    .Take(3)
                    .ToList()
            })
            .ToList();

        var myLeaderboard = new List<QuizLeaderboardEntryDto>();
        
        foreach (var group in groupedResults)
        {
            var resultsDto = group.TopResults.Select(r => new QuizResultEntryDto
            {
                ResultId = r.Id,
                UserId = r.UserId,
                Username = r.User?.Username ?? "Unknown",
                Score = r.Score,
                TotalQuestions = r.TotalQuestions,
                Percentage = r.Percentage,
                CompletedAt = r.CompletedAt
            }).ToList();

            myLeaderboard.Add(new QuizLeaderboardEntryDto
            {
                QuizId = group.QuizId,
                QuizTitle = group.Quiz?.Title ?? "Unknown Quiz",
                Results = resultsDto
            });
        }

        // Sort by quiz title
        myLeaderboard = myLeaderboard
            .OrderBy(q => q.QuizTitle)
            .ToList();

        return new MyLeaderboardDto
        {
            Quizzes = myLeaderboard
        };
    }

    private async Task<bool> CanUserAccessQuizAsync(int userId, Quiz quiz)
    {
        if (quiz.IsPublic || quiz.UserId == userId)
        {
            return true;
        }

        var friends = await _friendshipService.GetFriendsAsync(userId);
        var friendIds = friends
            .Select(f => f.RequesterId == userId ? f.AddresseeId : f.RequesterId)
            .ToHashSet();

        return friendIds.Contains(quiz.UserId);
    }
}
