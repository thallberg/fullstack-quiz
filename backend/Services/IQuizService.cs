using backend.DTOs;
using backend.Models;

namespace backend.Services;

public interface IQuizService
{
    Task<QuizResponseDto?> GetQuizByIdAsync(int id);
    Task<IEnumerable<QuizResponseDto>> GetAllQuizzesAsync();
    Task<GroupedQuizzesDto> GetGroupedQuizzesAsync(int userId);
    Task<IEnumerable<QuizResponseDto>> GetQuizzesByUserIdAsync(int userId);
    Task<QuizResponseDto> CreateQuizAsync(CreateQuizDto createQuizDto, int userId);
    Task<QuizResponseDto?> UpdateQuizAsync(int id, CreateQuizDto updateQuizDto, int userId);
    Task<bool> DeleteQuizAsync(int id, int userId);
}
