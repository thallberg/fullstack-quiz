using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class SubmitQuizResultDto
{
    [Range(1, int.MaxValue)]
    public int QuizId { get; set; }

    [Range(0, int.MaxValue)]
    public int Score { get; set; }

    [Range(1, int.MaxValue)]
    public int TotalQuestions { get; set; }

    [Range(0, 100)]
    public int Percentage { get; set; }

    public List<QuizAnswerDto> Answers { get; set; } = new();
}

public class QuizAnswerDto
{
    public int QuestionId { get; set; }
    public bool Answer { get; set; }
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

public class QuizResultQuestionDetailDto
{
    public int QuestionId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public bool CorrectAnswer { get; set; }
    public bool? UserAnswer { get; set; }
    public bool IsCorrect { get; set; }
}

public class QuizResultDetailsDto
{
    public int ResultId { get; set; }
    public int QuizId { get; set; }
    public string QuizTitle { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public int Percentage { get; set; }
    public DateTime CompletedAt { get; set; }
    public List<QuizResultQuestionDetailDto> Questions { get; set; } = new();
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
    public List<QuizLeaderboardEntryDto> PublicQuizzes { get; set; } = new();
}

public class MyLeaderboardDto
{
    public List<QuizLeaderboardEntryDto> Quizzes { get; set; } = new();
}
