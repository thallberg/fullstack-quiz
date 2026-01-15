using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("Quizzes")]
public class Quiz
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Required]
    [ForeignKey("User")]
    public int UserId { get; set; }

    // Navigation property - Many Quizzes to One User
    public User User { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property - One Quiz to Many Questions
    public ICollection<Question> Questions { get; set; } = new List<Question>();
}

[Table("Questions")]
public class Question
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Text { get; set; } = string.Empty;

    [Required]
    public bool CorrectAnswer { get; set; }

    [Required]
    [ForeignKey("Quiz")]
    public int QuizId { get; set; }

    // Navigation property - Many Questions to One Quiz
    public Quiz Quiz { get; set; } = null!;
}
