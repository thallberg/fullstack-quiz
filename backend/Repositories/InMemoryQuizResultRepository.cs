using backend.Models;

namespace backend.Repositories;

public class InMemoryQuizResultRepository : IQuizResultRepository
{
    private readonly List<QuizResult> _results = new();
    private int _nextId = 1;

    public Task<QuizResult> CreateAsync(QuizResult quizResult)
    {
        quizResult.Id = _nextId++;
        _results.Add(quizResult);
        return Task.FromResult(quizResult);
    }

    public Task<QuizResult?> GetBestResultForQuizAsync(int quizId)
    {
        var bestResult = _results
            .Where(r => r.QuizId == quizId)
            .OrderByDescending(r => r.Percentage)
            .ThenByDescending(r => r.CompletedAt)
            .FirstOrDefault();
        
        return Task.FromResult<QuizResult?>(bestResult);
    }

    public Task<IEnumerable<QuizResult>> GetResultsByQuizIdAsync(int quizId)
    {
        var results = _results
            .Where(r => r.QuizId == quizId)
            .OrderByDescending(r => r.Percentage)
            .ThenByDescending(r => r.CompletedAt)
            .ToList();
        
        return Task.FromResult<IEnumerable<QuizResult>>(results);
    }

    public Task<int> GetTotalAttemptsForQuizAsync(int quizId)
    {
        var count = _results.Count(r => r.QuizId == quizId);
        return Task.FromResult(count);
    }

    public Task<IEnumerable<QuizResult>> GetResultsByUserIdAsync(int userId)
    {
        var results = _results
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CompletedAt)
            .ToList();
        
        return Task.FromResult<IEnumerable<QuizResult>>(results);
    }
}
