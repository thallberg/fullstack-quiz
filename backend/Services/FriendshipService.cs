using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class FriendshipService : IFriendshipService
{
    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IUserRepository _userRepository;

    public FriendshipService(IFriendshipRepository friendshipRepository, IUserRepository userRepository)
    {
        _friendshipRepository = friendshipRepository;
        _userRepository = userRepository;
    }

    public async Task<FriendshipResponseDto> SendInviteAsync(int requesterId, string email)
    {
        // Check if user exists
        var addressee = await _userRepository.GetByEmailAsync(email);
        if (addressee == null)
        {
            throw new InvalidOperationException("Användare med denna e-post finns inte");
        }

        if (addressee.Id == requesterId)
        {
            throw new InvalidOperationException("Du kan inte bjuda in dig själv");
        }

        // Check if friendship already exists
        var existingFriendship = await _friendshipRepository.GetByRequesterAndAddresseeAsync(requesterId, addressee.Id);
        if (existingFriendship != null)
        {
            if (existingFriendship.Status == FriendshipStatus.Pending)
            {
                throw new InvalidOperationException("Inbjudan finns redan");
            }
            if (existingFriendship.Status == FriendshipStatus.Accepted)
            {
                throw new InvalidOperationException("Ni är redan vänner");
            }
            // If declined, update to pending
            existingFriendship.Status = FriendshipStatus.Pending;
            existingFriendship.CreatedAt = DateTime.UtcNow;
            existingFriendship = await _friendshipRepository.UpdateAsync(existingFriendship);
            return MapToDto(existingFriendship, requesterId);
        }

        // Create new friendship invite
        var friendship = new Friendship
        {
            RequesterId = requesterId,
            AddresseeId = addressee.Id,
            Status = FriendshipStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _friendshipRepository.CreateAsync(friendship);
        return MapToDto(created, requesterId);
    }

    public async Task<FriendshipResponseDto?> AcceptInviteAsync(int userId, int friendshipId)
    {
        var friendship = await _friendshipRepository.GetByIdAsync(friendshipId);
        if (friendship == null || friendship.AddresseeId != userId)
        {
            throw new InvalidOperationException("Inbjudan hittades inte");
        }

        if (friendship.Status != FriendshipStatus.Pending)
        {
            throw new InvalidOperationException("Inbjudan är inte längre giltig");
        }

        friendship.Status = FriendshipStatus.Accepted;
        friendship.AcceptedAt = DateTime.UtcNow;
        
        var updated = await _friendshipRepository.UpdateAsync(friendship);
        return MapToDto(updated, userId);
    }

    public async Task<bool> DeclineInviteAsync(int userId, int friendshipId)
    {
        var friendship = await _friendshipRepository.GetByIdAsync(friendshipId);
        if (friendship == null || friendship.AddresseeId != userId)
        {
            return false;
        }

        if (friendship.Status != FriendshipStatus.Pending)
        {
            return false;
        }

        return await _friendshipRepository.DeleteAsync(friendshipId);
    }

    public async Task<IEnumerable<FriendshipResponseDto>> GetPendingInvitesAsync(int userId)
    {
        var friendships = await _friendshipRepository.GetPendingInvitesAsync(userId);
        return friendships.Select(f => MapToDto(f, userId));
    }

    public async Task<IEnumerable<FriendshipResponseDto>> GetFriendsAsync(int userId)
    {
        var friendships = await _friendshipRepository.GetFriendsAsync(userId);
        return friendships.Select(f => MapToDto(f, userId));
    }

    public async Task<bool> RemoveFriendAsync(int userId, int friendshipId)
    {
        var friendship = await _friendshipRepository.GetByIdAsync(friendshipId);
        if (friendship == null)
        {
            return false;
        }

        // Check if user is part of this friendship
        if (friendship.RequesterId != userId && friendship.AddresseeId != userId)
        {
            return false;
        }

        return await _friendshipRepository.DeleteAsync(friendshipId);
    }

    private FriendshipResponseDto MapToDto(Friendship friendship, int currentUserId)
    {
        return new FriendshipResponseDto
        {
            Id = friendship.Id,
            RequesterId = friendship.RequesterId,
            RequesterUsername = friendship.Requester.Username,
            RequesterEmail = friendship.Requester.Email,
            AddresseeId = friendship.AddresseeId,
            AddresseeUsername = friendship.Addressee.Username,
            AddresseeEmail = friendship.Addressee.Email,
            Status = friendship.Status.ToString(),
            CreatedAt = friendship.CreatedAt,
            AcceptedAt = friendship.AcceptedAt
        };
    }
}
