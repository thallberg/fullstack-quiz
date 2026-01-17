using backend.Models;

namespace backend.Repositories;

public interface IQuizResultRepository
{
    Task<QuizResult> CreateAsync(QuizResult quizResult);
    Task<QuizResult?> GetBestResultForQuizAsync(int quizId);
    Task<IEnumerable<QuizResult>> GetResultsByQuizIdAsync(int quizId);
    Task<int> GetTotalAttemptsForQuizAsync(int quizId);
    Task<IEnumerable<QuizResult>> GetResultsByUserIdAsync(int userId);
}
