using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class QuizService : IQuizService
{
    private readonly IQuizRepository _quizRepository;
    private readonly IFriendshipService _friendshipService;

    public QuizService(IQuizRepository quizRepository, IFriendshipService friendshipService)
    {
        _quizRepository = quizRepository;
        _friendshipService = friendshipService;
    }

    public async Task<QuizResponseDto?> GetQuizByIdAsync(int id)
    {
        var quiz = await _quizRepository.GetByIdAsync(id);
        return quiz == null ? null : MapToDto(quiz);
    }

    public async Task<IEnumerable<QuizResponseDto>> GetAllQuizzesAsync()
    {
        var allQuizzes = await _quizRepository.GetAllAsync();
        return allQuizzes.Select(MapToDto);
    }

    public async Task<GroupedQuizzesDto> GetGroupedQuizzesAsync(int userId)
    {
        var allQuizzes = await _quizRepository.GetAllAsync();
        var allQuizzesDto = allQuizzes.Select(MapToDto).ToList();
        
        // Get user's friends
        var friends = await _friendshipService.GetFriendsAsync(userId);
        var friendIds = friends
            .Select(f => f.RequesterId == userId ? f.AddresseeId : f.RequesterId)
            .ToHashSet();
        
        // Group quizzes
        var myQuizzes = allQuizzesDto.Where(q => q.UserId == userId).ToList();
        var friendsQuizzes = allQuizzesDto.Where(q => 
            !q.IsPublic && friendIds.Contains(q.UserId)
        ).ToList();
        var publicQuizzes = allQuizzesDto.Where(q => 
            q.IsPublic && q.UserId != userId && !friendIds.Contains(q.UserId)
        ).ToList();
        
        return new GroupedQuizzesDto
        {
            MyQuizzes = myQuizzes,
            FriendsQuizzes = friendsQuizzes,
            PublicQuizzes = publicQuizzes
        };
    }

    public async Task<IEnumerable<QuizResponseDto>> GetQuizzesByUserIdAsync(int userId)
    {
        var quizzes = await _quizRepository.GetByUserIdAsync(userId);
        return quizzes.Select(MapToDto);
    }

    public async Task<QuizResponseDto> CreateQuizAsync(CreateQuizDto createQuizDto, int userId)
    {
        var quiz = new Quiz
        {
            Title = createQuizDto.Title,
            Description = createQuizDto.Description,
            UserId = userId,
            IsPublic = createQuizDto.IsPublic,
            Questions = createQuizDto.Questions.Select(q => new Question
            {
                Text = q.Text,
                CorrectAnswer = q.CorrectAnswer
            }).ToList()
        };

        var createdQuiz = await _quizRepository.CreateAsync(quiz);
        return MapToDto(createdQuiz);
    }

    public async Task<QuizResponseDto?> UpdateQuizAsync(int id, CreateQuizDto updateQuizDto, int userId)
    {
        var existingQuiz = await _quizRepository.GetByIdAsync(id);
        if (existingQuiz == null)
            return null;

        if (existingQuiz.UserId != userId)
            throw new UnauthorizedAccessException("You don't have permission to update this quiz");

        existingQuiz.Title = updateQuizDto.Title;
        existingQuiz.Description = updateQuizDto.Description;
        existingQuiz.IsPublic = updateQuizDto.IsPublic;
        
        // Update questions
        existingQuiz.Questions.Clear();
        foreach (var questionDto in updateQuizDto.Questions)
        {
            existingQuiz.Questions.Add(new Question
            {
                Text = questionDto.Text,
                CorrectAnswer = questionDto.CorrectAnswer
            });
        }

        var updatedQuiz = await _quizRepository.UpdateAsync(existingQuiz);
        return MapToDto(updatedQuiz);
    }

    public async Task<bool> DeleteQuizAsync(int id, int userId)
    {
        var quiz = await _quizRepository.GetByIdAsync(id);
        if (quiz == null)
            return false;

        if (quiz.UserId != userId)
            throw new UnauthorizedAccessException("You don't have permission to delete this quiz");

        return await _quizRepository.DeleteAsync(id);
    }


    private static QuizResponseDto MapToDto(Quiz quiz)
    {
        return new QuizResponseDto
        {
            Id = quiz.Id,
            Title = quiz.Title,
            Description = quiz.Description,
            UserId = quiz.UserId,
            Username = quiz.User?.Username ?? string.Empty,
            CreatedAt = quiz.CreatedAt,
            IsPublic = quiz.IsPublic,
            Questions = quiz.Questions.Select(question => new QuestionResponseDto
            {
                Id = question.Id,
                Text = question.Text,
                CorrectAnswer = question.CorrectAnswer
            }).ToList()
        };
    }
}
