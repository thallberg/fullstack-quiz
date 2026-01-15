using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class QuizRepository : IQuizRepository
{
    private readonly ApplicationDbContext _context;

    public QuizRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Quiz?> GetByIdAsync(int id)
    {
        return await _context.Quizzes
            .Include(q => q.User)
            .Include(q => q.Questions)
            .FirstOrDefaultAsync(q => q.Id == id);
    }

    public async Task<IEnumerable<Quiz>> GetAllAsync()
    {
        return await _context.Quizzes
            .Include(q => q.User)
            .Include(q => q.Questions)
            .ToListAsync();
    }

    public async Task<IEnumerable<Quiz>> GetByUserIdAsync(int userId)
    {
        return await _context.Quizzes
            .Include(q => q.User)
            .Include(q => q.Questions)
            .Where(q => q.UserId == userId)
            .ToListAsync();
    }

    public async Task<Quiz> CreateAsync(Quiz quiz)
    {
        _context.Quizzes.Add(quiz);
        await _context.SaveChangesAsync();
        
        // Load navigation properties after creation
        return await _context.Quizzes
            .Include(q => q.User)
            .Include(q => q.Questions)
            .FirstOrDefaultAsync(q => q.Id == quiz.Id) ?? quiz;
    }

    public async Task<Quiz> UpdateAsync(Quiz quiz)
    {
        _context.Quizzes.Update(quiz);
        await _context.SaveChangesAsync();
        
        // Load navigation properties after update
        return await _context.Quizzes
            .Include(q => q.User)
            .Include(q => q.Questions)
            .FirstOrDefaultAsync(q => q.Id == quiz.Id) ?? quiz;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var quiz = await _context.Quizzes.FindAsync(id);
        if (quiz == null)
            return false;

        _context.Quizzes.Remove(quiz);
        await _context.SaveChangesAsync();
        return true;
    }
}
