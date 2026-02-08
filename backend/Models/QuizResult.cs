using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("QuizResults")]
public class QuizResult
{
    [Key]
    public int Id { get; set; }

    [Required]
    [ForeignKey("User")]
    public int UserId { get; set; }

    // Navigation property - Many QuizResults to One User
    public User User { get; set; } = null!;

    [Required]
    [ForeignKey("Quiz")]
    public int QuizId { get; set; }

    // Navigation property - Many QuizResults to One Quiz
    public Quiz Quiz { get; set; } = null!;

    [Required]
    public int Score { get; set; } // Number of correct answers

    [Required]
    public int TotalQuestions { get; set; }

    [Required]
    public int Percentage { get; set; } // Percentage correct (0-100)

    [Required]
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

    public string? AnswersJson { get; set; }
}
