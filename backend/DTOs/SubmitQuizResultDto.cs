namespace backend.DTOs;

public class SubmitQuizResultDto
{
    public int QuizId { get; set; }
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public int Percentage { get; set; }
}

public class QuizResultEntryDto
{
    public int ResultId { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public int Percentage { get; set; }
    public DateTime CompletedAt { get; set; }
}

public class QuizLeaderboardEntryDto
{
    public int QuizId { get; set; }
    public string QuizTitle { get; set; } = string.Empty;
    public List<QuizResultEntryDto> Results { get; set; } = new();
}

public class LeaderboardDto
{
    public List<QuizLeaderboardEntryDto> MyQuizzes { get; set; } = new();
    public List<QuizLeaderboardEntryDto> FriendsQuizzes { get; set; } = new();
}
