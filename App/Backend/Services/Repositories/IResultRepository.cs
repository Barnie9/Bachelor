using Models;

namespace Services;

public interface IResultRepository
{
    Task<Result?> CreateAsync(Result result);
    Task<IEnumerable<Result>> GetResultsByEmployeeIdAsync(Guid employeeId);
}