using Models;

namespace Services;

public interface IEmployeeRepository
{
    Task<Employee?> GetEmployeeByUsernameAsync(string username);
    Task<IEnumerable<Employee>> GetEmployeesByTeamIdAsync(Guid teamId);
}