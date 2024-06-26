using Models;

namespace Services;

public class EmotionPercentageService : IEmotionPercentageService
{
    private readonly IResultRepository _resultRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ITeamRepository _teamRepository;

    public EmotionPercentageService(IResultRepository resultRepository, IEmployeeRepository employeeRepository, ITeamRepository teamRepository)
    {
        _resultRepository = resultRepository;
        _employeeRepository = employeeRepository;
        _teamRepository = teamRepository;
    }

    public async Task<IEnumerable<EmotionPercentageDto>> GetEmotionPercentagesForEmployee(Guid employeeId, TimeRangeDto timeRangeDto)
    {
        var results = await _resultRepository.GetResultsByEmployeeIdAsync(employeeId);
        if (!results.Any())
        {
            return new List<EmotionPercentageDto>();
        }

        results = Filter.FilterResultsByTimeRange(results, timeRangeDto);

        return Generator.GenerateEmotionPercentages(results);
    }

    public async Task<IEnumerable<EmotionPercentageDto>> GetEmotionPercentagesForTeam(Guid teamId, TimeRangeDto timeRangeDto)
    {
        var employees = await _employeeRepository.GetEmployeesByTeamIdAsync(teamId);
        if (!employees.Any())
        {
            return new List<EmotionPercentageDto>();
        }

        var allResults = new List<IEnumerable<Result>>();
        foreach (var employee in employees)
        {
            allResults.Add(await _resultRepository.GetResultsByEmployeeIdAsync(employee.Id));
        }

        var results = allResults.SelectMany(r => r);
        if (!results.Any())
        {
            return new List<EmotionPercentageDto>();
        }

        results = Filter.FilterResultsByTimeRange(results, timeRangeDto);

        return Generator.GenerateEmotionPercentages(results);
    }

    public async Task<IEnumerable<EmotionPercentageDto>> GetEmotionPercentagesForManager(Guid managerId, TimeRangeDto timeRangeDto)
    {
        var team = await _teamRepository.GetTeamByManagerIdAsync(managerId);
        if (team == null)
        {
            return new List<EmotionPercentageDto>();
        }

        return await GetEmotionPercentagesForTeam(team.Id, timeRangeDto);
    }
}