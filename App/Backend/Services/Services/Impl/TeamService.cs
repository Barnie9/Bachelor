using Models;

namespace Services;

public class TeamService : ITeamService
{
    private readonly ITeamRepository _teamRepository;
    private readonly IEmployeeRepository _employeeRepository;

    public TeamService(ITeamRepository teamRepository, IEmployeeRepository employeeRepository)
    {
        _teamRepository = teamRepository;
        _employeeRepository = employeeRepository;
    }

    public async Task<IEnumerable<TeamDto>> GetTeamsAsync()
    {
        var teams = await _teamRepository.GetTeamsAsync();
        if (!teams.Any())
        {
            return new List<TeamDto>();
        }

        var teamDtos = new List<TeamDto>();

        foreach (var team in teams)
        {
            var employees = await _employeeRepository.GetEmployeesByTeamIdAsync(team.Id);
            teamDtos.Add(new TeamDto
            {
                Id = team.Id,
                Name = team.Name,
                Employees = employees.Select(e => EmployeeDto.FromEmployee(e)).ToList()
            });
        }

        return teamDtos;
    }
}