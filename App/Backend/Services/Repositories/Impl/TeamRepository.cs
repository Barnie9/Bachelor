using Microsoft.EntityFrameworkCore;
using Models;

namespace Services;

public class TeamRepository : ITeamRepository
{
    private readonly MyDbContext _context;
    private readonly DbSet<Team> _teams;

    public TeamRepository(MyDbContext context)
    {
        _context = context;
        _teams = context.Teams;
    }

    public async Task<Team?> GetTeamByManagerIdAsync(Guid managerId)
    {
        return await _teams.FirstOrDefaultAsync(t => t.ManagerId == managerId);
    }

    public async Task<IEnumerable<Team>> GetTeamsAsync()
    {
        return await _teams.ToListAsync();
    }
}