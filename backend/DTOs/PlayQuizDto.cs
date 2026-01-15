public class PlayQuizDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public List<PlayQuestionDto> Questions { get; set; } = new();
}

public class PlayQuestionDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
}
