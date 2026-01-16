using backend.Models;

namespace backend.Repositories;

public class InMemoryFriendshipRepository : IFriendshipRepository
{
    private static readonly List<Friendship> _friendships = new();
    private static int _nextId = 1;
    private readonly IUserRepository? _userRepository;

    public InMemoryFriendshipRepository(IUserRepository? userRepository = null)
    {
        _userRepository = userRepository;
    }

    public async Task<Friendship?> GetByIdAsync(int id)
    {
        var friendship = _friendships.FirstOrDefault(f => f.Id == id);
        if (friendship != null)
        {
            return await LoadNavigationPropertiesAsync(friendship);
        }
        return null;
    }

    public async Task<IEnumerable<Friendship>> GetPendingInvitesAsync(int userId)
    {
        var invites = _friendships
            .Where(f => f.AddresseeId == userId && f.Status == FriendshipStatus.Pending)
            .OrderByDescending(f => f.CreatedAt)
            .ToList();
        
        var loadedInvites = new List<Friendship>();
        foreach (var invite in invites)
        {
            loadedInvites.Add(await LoadNavigationPropertiesAsync(invite));
        }
        
        return loadedInvites;
    }

    public async Task<IEnumerable<Friendship>> GetFriendsAsync(int userId)
    {
        var friends = _friendships
            .Where(f => f.Status == FriendshipStatus.Accepted && 
                       (f.RequesterId == userId || f.AddresseeId == userId))
            .OrderByDescending(f => f.AcceptedAt ?? f.CreatedAt)
            .ToList();
        
        var loadedFriends = new List<Friendship>();
        foreach (var friend in friends)
        {
            loadedFriends.Add(await LoadNavigationPropertiesAsync(friend));
        }
        
        return loadedFriends;
    }

    public async Task<Friendship?> GetByRequesterAndAddresseeAsync(int requesterId, int addresseeId)
    {
        var friendship = _friendships.FirstOrDefault(f => 
            (f.RequesterId == requesterId && f.AddresseeId == addresseeId) ||
            (f.RequesterId == addresseeId && f.AddresseeId == requesterId));
        
        if (friendship != null)
        {
            return await LoadNavigationPropertiesAsync(friendship);
        }
        
        return null;
    }

    public async Task<Friendship> CreateAsync(Friendship friendship)
    {
        friendship.Id = _nextId++;
        friendship.CreatedAt = DateTime.UtcNow;
        _friendships.Add(friendship);
        return await LoadNavigationPropertiesAsync(friendship);
    }

    public async Task<Friendship> UpdateAsync(Friendship friendship)
    {
        var index = _friendships.FindIndex(f => f.Id == friendship.Id);
        if (index >= 0)
        {
            _friendships[index] = friendship;
        }
        return await LoadNavigationPropertiesAsync(friendship);
    }

    public Task<bool> DeleteAsync(int id)
    {
        var friendship = _friendships.FirstOrDefault(f => f.Id == id);
        if (friendship == null)
            return Task.FromResult(false);

        _friendships.Remove(friendship);
        return Task.FromResult(true);
    }

    private async Task<Friendship> LoadNavigationPropertiesAsync(Friendship friendship)
    {
        if (friendship.Requester == null && _userRepository != null)
        {
            friendship.Requester = await _userRepository.GetByIdAsync(friendship.RequesterId) ?? new User
            {
                Id = friendship.RequesterId,
                Username = "Unknown",
                Email = ""
            };
        }

        if (friendship.Addressee == null && _userRepository != null)
        {
            friendship.Addressee = await _userRepository.GetByIdAsync(friendship.AddresseeId) ?? new User
            {
                Id = friendship.AddresseeId,
                Username = "Unknown",
                Email = ""
            };
        }

        return friendship;
    }
}
