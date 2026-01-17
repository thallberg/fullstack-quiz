namespace backend.DTOs;

public class CreateQuizDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsPublic { get; set; } = true;
    public List<CreateQuestionDto> Questions { get; set; } = new();
}

public class CreateQuestionDto
{
    public string Text { get; set; } = string.Empty;
    public bool CorrectAnswer { get; set; }
}
