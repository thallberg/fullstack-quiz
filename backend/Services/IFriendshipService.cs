using backend.DTOs;

namespace backend.Services;

public interface IFriendshipService
{
    Task<FriendshipResponseDto> SendInviteAsync(int requesterId, string email);
    Task<FriendshipResponseDto?> AcceptInviteAsync(int userId, int friendshipId);
    Task<bool> DeclineInviteAsync(int userId, int friendshipId);
    Task<IEnumerable<FriendshipResponseDto>> GetPendingInvitesAsync(int userId);
    Task<IEnumerable<FriendshipResponseDto>> GetFriendsAsync(int userId);
    Task<bool> RemoveFriendAsync(int userId, int friendshipId);
}
