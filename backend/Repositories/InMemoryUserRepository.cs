using backend.Models;

namespace backend.Repositories;

public class InMemoryUserRepository : IUserRepository
{
    private static readonly List<User> _users = new();
    private static int _nextId = 1;

    public Task<User?> GetByIdAsync(int id)
    {
        var user = _users.FirstOrDefault(u => u.Id == id);
        return Task.FromResult(user);
    }

    public Task<User?> GetByEmailAsync(string email)
    {
        var user = _users.FirstOrDefault(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        return Task.FromResult(user);
    }

    public Task<IEnumerable<User>> GetAllAsync()
    {
        return Task.FromResult<IEnumerable<User>>(_users.ToList());
    }

    public Task<User> CreateAsync(User user)
    {
        user.Id = _nextId++;
        user.CreatedAt = DateTime.UtcNow;
        _users.Add(user);
        return Task.FromResult(user);
    }

    public Task<User> UpdateAsync(User user)
    {
        var index = _users.FindIndex(u => u.Id == user.Id);
        if (index >= 0)
        {
            _users[index] = user;
        }
        return Task.FromResult(user);
    }

    public Task<bool> DeleteAsync(int id)
    {
        var user = _users.FirstOrDefault(u => u.Id == id);
        if (user == null)
            return Task.FromResult(false);

        _users.Remove(user);
        return Task.FromResult(true);
    }
}
