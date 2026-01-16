using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class FriendshipRepository : IFriendshipRepository
{
    private readonly ApplicationDbContext _context;

    public FriendshipRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Friendship?> GetByIdAsync(int id)
    {
        return await _context.Friendships
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .FirstOrDefaultAsync(f => f.Id == id);
    }

    public async Task<IEnumerable<Friendship>> GetPendingInvitesAsync(int userId)
    {
        return await _context.Friendships
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .Where(f => f.AddresseeId == userId && f.Status == FriendshipStatus.Pending)
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Friendship>> GetFriendsAsync(int userId)
    {
        return await _context.Friendships
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .Where(f => f.Status == FriendshipStatus.Accepted && 
                       (f.RequesterId == userId || f.AddresseeId == userId))
            .OrderByDescending(f => f.AcceptedAt ?? f.CreatedAt)
            .ToListAsync();
    }

    public async Task<Friendship?> GetByRequesterAndAddresseeAsync(int requesterId, int addresseeId)
    {
        return await _context.Friendships
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .FirstOrDefaultAsync(f => 
                (f.RequesterId == requesterId && f.AddresseeId == addresseeId) ||
                (f.RequesterId == addresseeId && f.AddresseeId == requesterId));
    }

    public async Task<Friendship> CreateAsync(Friendship friendship)
    {
        _context.Friendships.Add(friendship);
        await _context.SaveChangesAsync();
        
        // Reload to include navigation properties
        return await GetByIdAsync(friendship.Id) ?? friendship;
    }

    public async Task<Friendship> UpdateAsync(Friendship friendship)
    {
        _context.Friendships.Update(friendship);
        await _context.SaveChangesAsync();
        
        // Reload to include navigation properties
        return await GetByIdAsync(friendship.Id) ?? friendship;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var friendship = await _context.Friendships.FindAsync(id);
        if (friendship == null)
            return false;

        _context.Friendships.Remove(friendship);
        await _context.SaveChangesAsync();
        return true;
    }
}
