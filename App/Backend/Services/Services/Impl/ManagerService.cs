using Models;

namespace Services;

public class ManagerService : IManagerService
{
    private readonly IManagerRepository _managerRepository;

    public ManagerService(IManagerRepository managerRepository)
    {
        _managerRepository = managerRepository;
    }

    public async Task<ManagerDto?> GetManagerByEmailAsync(string email)
    {
        var manager = await _managerRepository.GetManagerByEmailAsync(email);
        if (manager == null)
        {
            return null;
        }

        return new ManagerDto
        {
            Id = manager.Id,
            Email = manager.Email,
            Username = manager.Username,
            IsAdmin = manager.IsAdmin
        };
    }
}