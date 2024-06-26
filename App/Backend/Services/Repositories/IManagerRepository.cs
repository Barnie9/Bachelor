using Models;

namespace Services;

public interface IManagerRepository
{
    Task<Manager?> GetManagerByEmailAsync(string email);
}