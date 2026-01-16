using backend.Models;

namespace backend.Repositories;

public interface IFriendshipRepository
{
    Task<Friendship?> GetByIdAsync(int id);
    Task<IEnumerable<Friendship>> GetPendingInvitesAsync(int userId);
    Task<IEnumerable<Friendship>> GetFriendsAsync(int userId);
    Task<Friendship?> GetByRequesterAndAddresseeAsync(int requesterId, int addresseeId);
    Task<Friendship> CreateAsync(Friendship friendship);
    Task<Friendship> UpdateAsync(Friendship friendship);
    Task<bool> DeleteAsync(int id);
}
