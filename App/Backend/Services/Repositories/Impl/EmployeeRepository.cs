using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly MyDbContext _context;
    private readonly DbSet<Employee> _employees;

    public EmployeeRepository(MyDbContext context)
    {
        _context = context;
        _employees = context.Employees;
    }

    public async Task<Employee?> GetEmployeeByUsernameAsync(string username)
    {
        return await _employees.FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<IEnumerable<Employee>> GetEmployeesByTeamIdAsync(Guid teamId)
    {
        return await _employees.Where(e => e.TeamId == teamId).ToListAsync();
    }
}