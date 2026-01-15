using backend.Models;

namespace backend.Repositories;

public class InMemoryQuizRepository : IQuizRepository
{
    private static readonly List<Quiz> _quizzes = new();
    private static int _nextQuizId = 1;
    private static int _nextQuestionId = 1;
    private readonly IUserRepository? _userRepository;

    // Constructor for dependency injection - UserRepository is optional for in-memory storage
    public InMemoryQuizRepository(IUserRepository? userRepository = null)
    {
        _userRepository = userRepository;
    }

    private async Task LoadNavigationProperties(Quiz quiz)
    {
        if (quiz.User == null && _userRepository != null)
        {
            quiz.User = await _userRepository.GetByIdAsync(quiz.UserId) ?? new User
            {
                Id = quiz.UserId,
                Username = "Unknown",
                Email = ""
            };
        }
        quiz.Questions = quiz.Questions ?? new List<Question>();
    }

    public async Task<Quiz?> GetByIdAsync(int id)
    {
        var quiz = _quizzes.FirstOrDefault(q => q.Id == id);
        if (quiz != null)
        {
            await LoadNavigationProperties(quiz);
        }
        return quiz;
    }

    public async Task<IEnumerable<Quiz>> GetAllAsync()
    {
        var quizzes = _quizzes.ToList();
        foreach (var quiz in quizzes)
        {
            await LoadNavigationProperties(quiz);
        }
        return quizzes;
    }

    public async Task<IEnumerable<Quiz>> GetByUserIdAsync(int userId)
    {
        var quizzes = _quizzes.Where(q => q.UserId == userId).ToList();
        foreach (var quiz in quizzes)
        {
            await LoadNavigationProperties(quiz);
        }
        return quizzes;
    }

    public async Task<Quiz> CreateAsync(Quiz quiz)
    {
        quiz.Id = _nextQuizId++;
        quiz.CreatedAt = DateTime.UtcNow;
        
        // Assign IDs to questions
        foreach (var question in quiz.Questions)
        {
            if (question.Id == 0)
            {
                question.Id = _nextQuestionId++;
            }
            question.QuizId = quiz.Id;
        }
        
        await LoadNavigationProperties(quiz);
        _quizzes.Add(quiz);
        return quiz;
    }

    public async Task<Quiz> UpdateAsync(Quiz quiz)
    {
        var index = _quizzes.FindIndex(q => q.Id == quiz.Id);
        if (index >= 0)
        {
            // Assign IDs to new questions
            foreach (var question in quiz.Questions)
            {
                if (question.Id == 0)
                {
                    question.Id = _nextQuestionId++;
                }
                question.QuizId = quiz.Id;
            }
            
            await LoadNavigationProperties(quiz);
            _quizzes[index] = quiz;
        }
        return quiz;
    }

    public Task<bool> DeleteAsync(int id)
    {
        var quiz = _quizzes.FirstOrDefault(q => q.Id == id);
        if (quiz == null)
            return Task.FromResult(false);

        _quizzes.Remove(quiz);
        return Task.FromResult(true);
    }
}
