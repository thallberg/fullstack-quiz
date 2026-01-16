using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class FriendshipInviteDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}
