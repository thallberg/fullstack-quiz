using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("Friendships")]
public class Friendship
{
    [Key]
    public int Id { get; set; }

    [Required]
    [ForeignKey("Requester")]
    public int RequesterId { get; set; }

    [Required]
    [ForeignKey("Addressee")]
    public int AddresseeId { get; set; }

    [Required]
    public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? AcceptedAt { get; set; }

    // Navigation properties
    public User Requester { get; set; } = null!;
    public User Addressee { get; set; } = null!;
}

public enum FriendshipStatus
{
    Pending = 0,
    Accepted = 1,
    Declined = 2
}
