using Models;

namespace Services;

public interface IManagerService
{
    Task<ManagerDto?> GetManagerByEmailAsync(string email);
}