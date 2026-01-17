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
        var existingQuiz = await _context.Quizzes
            .Include(q => q.Questions)
            .FirstOrDefaultAsync(q => q.Id == quiz.Id);
        
        if (existingQuiz == null)
        {
            throw new InvalidOperationException("Quiz not found");
        }

        // Update basic properties
        existingQuiz.Title = quiz.Title;
        existingQuiz.Description = quiz.Description;

        // Remove old questions
        _context.Questions.RemoveRange(existingQuiz.Questions);
        
        // Add new questions
        existingQuiz.Questions = quiz.Questions;

        await _context.SaveChangesAsync();
        
        // Load navigation properties after update
        return await _context.Quizzes
            .Include(q => q.User)
            .Include(q => q.Questions)
            .FirstOrDefaultAsync(q => q.Id == quiz.Id) ?? existingQuiz;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var quiz = await _context.Quizzes
            .Include(q => q.Questions)
            .FirstOrDefaultAsync(q => q.Id == id);
            
        if (quiz == null)
            return false;

        // Delete related QuizResults first (ensures deletion works even before migration is applied)
        var relatedResults = await _context.QuizResults
            .Where(r => r.QuizId == id)
            .ToListAsync();
        if (relatedResults.Any())
        {
            _context.QuizResults.RemoveRange(relatedResults);
        }

        // Delete the quiz (Questions will be cascade deleted automatically)
        _context.Quizzes.Remove(quiz);
        await _context.SaveChangesAsync();
        return true;
    }
}
