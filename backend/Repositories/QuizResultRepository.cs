using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class QuizResultRepository : IQuizResultRepository
{
    private readonly ApplicationDbContext _context;

    public QuizResultRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<QuizResult> CreateAsync(QuizResult quizResult)
    {
        _context.QuizResults.Add(quizResult);
        await _context.SaveChangesAsync();
        
        // Load navigation properties after creation
        return await _context.QuizResults
            .Include(r => r.User)
            .Include(r => r.Quiz)
            .FirstOrDefaultAsync(r => r.Id == quizResult.Id) ?? quizResult;
    }

    public async Task<QuizResult?> GetBestResultForQuizAsync(int quizId)
    {
        return await _context.QuizResults
            .Include(r => r.User)
            .Where(r => r.QuizId == quizId)
            .OrderByDescending(r => r.Percentage)
            .ThenByDescending(r => r.CompletedAt)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<QuizResult>> GetResultsByQuizIdAsync(int quizId)
    {
        return await _context.QuizResults
            .Include(r => r.User)
            .Where(r => r.QuizId == quizId)
            .OrderByDescending(r => r.Percentage)
            .ThenByDescending(r => r.CompletedAt)
            .ToListAsync();
    }

    public async Task<int> GetTotalAttemptsForQuizAsync(int quizId)
    {
        return await _context.QuizResults
            .Where(r => r.QuizId == quizId)
            .CountAsync();
    }

    public async Task<IEnumerable<QuizResult>> GetResultsByUserIdAsync(int userId)
    {
        return await _context.QuizResults
            .Include(r => r.Quiz)
            .Include(r => r.User)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CompletedAt)
            .ToListAsync();
    }
}
