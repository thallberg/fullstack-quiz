using backend.Models;

namespace backend.Repositories;

public interface IQuizRepository
{
    Task<Quiz?> GetByIdAsync(int id);
    Task<IEnumerable<Quiz>> GetAllAsync();
    Task<IEnumerable<Quiz>> GetByUserIdAsync(int userId);
    Task<Quiz> CreateAsync(Quiz quiz);
    Task<Quiz> UpdateAsync(Quiz quiz);
    Task<bool> DeleteAsync(int id);
}
