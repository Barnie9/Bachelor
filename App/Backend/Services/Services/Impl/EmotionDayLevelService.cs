using Models;

namespace Services;

public class EmotionDayLevelService : IEmotionDayLevelService
{
    private readonly IResultRepository _resultRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ITeamRepository _teamRepository;

    public EmotionDayLevelService(IResultRepository resultRepository, IEmployeeRepository employeeRepository, ITeamRepository teamRepository)
    {
        _resultRepository = resultRepository;
        _employeeRepository = employeeRepository;
        _teamRepository = teamRepository;
    }

    public async Task<IEnumerable<EmotionDayLevelDto>> GetEmotionDayLevelsForEmployee(string emotionName, Guid employeeId, TimeRangeDto timeRangeDto)
    {
        var results = await _resultRepository.GetResultsByEmployeeIdAsync(employeeId);
        if (!results.Any())
        {
            return Generator.GenerateEmotionDayLevels(new List<Result>(), timeRangeDto);
        }

        results = Filter.FilterResultsByTimeRangeAndEmotionName(results, timeRangeDto, emotionName);

        return Generator.GenerateEmotionDayLevels(results, timeRangeDto);
    }

    public async Task<IEnumerable<EmotionDayLevelDto>> GetEmotionDayLevelsForTeam(string emotionName, Guid teamId, TimeRangeDto timeRangeDto)
    {
        var employees = await _employeeRepository.GetEmployeesByTeamIdAsync(teamId);
        if (!employees.Any())
        {
            return Generator.GenerateEmotionDayLevels(new List<Result>(), timeRangeDto);
        }

        var allResults = new List<IEnumerable<Result>>();
        foreach (var employee in employees)
        {
            allResults.Add(await _resultRepository.GetResultsByEmployeeIdAsync(employee.Id));
        }

        var results = allResults.SelectMany(r => r);
        if (!results.Any())
        {
            return Generator.GenerateEmotionDayLevels(new List<Result>(), timeRangeDto);
        }

        results = Filter.FilterResultsByTimeRangeAndEmotionName(results, timeRangeDto, emotionName);

        return Generator.GenerateEmotionDayLevels(results, timeRangeDto);
    }

    public async Task<IEnumerable<EmotionDayLevelDto>> GetEmotionDayLevelsForManager(string emotionName, Guid managerId, TimeRangeDto timeRangeDto)
    {
        var team = await _teamRepository.GetTeamByManagerIdAsync(managerId);
        if (team == null)
        {
            return Generator.GenerateEmotionDayLevels(new List<Result>(), timeRangeDto);
        }

        return await GetEmotionDayLevelsForTeam(emotionName, team.Id, timeRangeDto);
    }
}