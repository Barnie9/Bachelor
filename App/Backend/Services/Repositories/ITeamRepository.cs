using Models;

namespace Services;

public interface ITeamRepository
{
    Task<Team?> GetTeamByManagerIdAsync(Guid managerId);
    Task<IEnumerable<Team>> GetTeamsAsync();
}