namespace backend.DTOs;

public class QuizResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsPublic { get; set; } = true;
    public List<QuestionResponseDto> Questions { get; set; } = new();
}

public class QuestionResponseDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool CorrectAnswer { get; set; }
}
