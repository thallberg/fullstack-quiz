namespace backend.DTOs;

public class SubmitQuizResultDto
{
    public int QuizId { get; set; }
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public int Percentage { get; set; }
}

public class QuizLeaderboardEntryDto
{
    public int QuizId { get; set; }
    public string QuizTitle { get; set; } = string.Empty;
    public int? BestScore { get; set; }
    public int? BestPercentage { get; set; }
    public string? BestUsername { get; set; }
    public int? BestUserId { get; set; }
    public DateTime? BestCompletedAt { get; set; }
    public int TotalAttempts { get; set; }
}

public class LeaderboardDto
{
    public List<QuizLeaderboardEntryDto> MyQuizzes { get; set; } = new();
    public List<QuizLeaderboardEntryDto> FriendsQuizzes { get; set; } = new();
}
