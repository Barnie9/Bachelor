using Models;

namespace Services;

public interface ITeamService
{
    Task<IEnumerable<TeamDto>> GetTeamsAsync();
}