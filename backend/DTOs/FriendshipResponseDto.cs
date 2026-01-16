namespace backend.DTOs;

public class FriendshipResponseDto
{
    public int Id { get; set; }
    public int RequesterId { get; set; }
    public string RequesterUsername { get; set; } = string.Empty;
    public string RequesterEmail { get; set; } = string.Empty;
    public int AddresseeId { get; set; }
    public string AddresseeUsername { get; set; } = string.Empty;
    public string AddresseeEmail { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? AcceptedAt { get; set; }
}
