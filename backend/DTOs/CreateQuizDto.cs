using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreateQuizDto
{
    [Required]
    [StringLength(200, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    public bool IsPublic { get; set; } = true;

    [MinLength(1, ErrorMessage = "Quiz must contain at least one question")]
    public List<CreateQuestionDto> Questions { get; set; } = new();
}

public class CreateQuestionDto
{
    [Required]
    [StringLength(500, MinimumLength = 1)]
    public string Text { get; set; } = string.Empty;

    [Required]
    public bool CorrectAnswer { get; set; }
}
