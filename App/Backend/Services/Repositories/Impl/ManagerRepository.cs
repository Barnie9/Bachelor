using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;

public class ManagerRepository : IManagerRepository
{
    private readonly MyDbContext _context;
    private readonly DbSet<Manager> _managers;

    public ManagerRepository(MyDbContext context)
    {
        _context = context;
        _managers = context.Managers;
    }

    public async Task<Manager?> GetManagerByEmailAsync(string email)
    {
        return await _managers.FirstOrDefaultAsync(m => m.Email == email);
    }
}