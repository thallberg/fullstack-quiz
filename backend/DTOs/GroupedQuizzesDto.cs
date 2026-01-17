namespace backend.DTOs;

public class GroupedQuizzesDto
{
    public List<QuizResponseDto> MyQuizzes { get; set; } = new();
    public List<QuizResponseDto> FriendsQuizzes { get; set; } = new();
    public List<QuizResponseDto> PublicQuizzes { get; set; } = new();
}
