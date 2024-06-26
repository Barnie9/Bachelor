using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;

public class ResultRepository : IResultRepository
{
    private readonly MyDbContext _context;
    private readonly DbSet<Result> _results;

    public ResultRepository(MyDbContext context)
    {
        _context = context;
        _results = context.Results;
    }

    public async Task<Result?> CreateAsync(Result result)
    {
        await _results.AddAsync(result);
        await _context.SaveChangesAsync();
        return result;
    }

    public async Task<IEnumerable<Result>> GetResultsByEmployeeIdAsync(Guid employeeId)
    {
        return await _results.Where(r => r.EmployeeId == employeeId).Include(r => r.Emotion).ToListAsync();
    }
}