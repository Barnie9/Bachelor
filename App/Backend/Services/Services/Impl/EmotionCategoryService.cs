using Models;

namespace Services;

public class EmotionCategoryService : IEmotionCategoryService
{
    private readonly IResultRepository _resultRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly ITeamRepository _teamRepository;

    public EmotionCategoryService(IResultRepository resultRepository, IEmployeeRepository employeeRepository, ITeamRepository teamRepository)
    {
        _resultRepository = resultRepository;
        _employeeRepository = employeeRepository;
        _teamRepository = teamRepository;
    }

    public async Task<IEnumerable<EmotionCategoryDto>> GetEmotionCategoriesForEmployee(Guid employeeId, TimeRangeDto timeRangeDto)
    {
        var results = await _resultRepository.GetResultsByEmployeeIdAsync(employeeId);
        if (!results.Any())
        {
            return new List<EmotionCategoryDto>();
        }

        results = Filter.FilterResultsByTimeRange(results, timeRangeDto);

        return Generator.GenerateEmotionCategories(results);
    }

    public async Task<IEnumerable<EmotionCategoryDto>> GetEmotionCategoriesForTeam(Guid teamId, TimeRangeDto timeRangeDto)
    {
        var employees = await _employeeRepository.GetEmployeesByTeamIdAsync(teamId);
        if (!employees.Any())
        {
            return new List<EmotionCategoryDto>();
        }

        var allResults = new List<IEnumerable<Result>>();
        foreach (var employee in employees)
        {
            allResults.Add(await _resultRepository.GetResultsByEmployeeIdAsync(employee.Id));
        }

        var results = allResults.SelectMany(r => r);
        if (!results.Any())
        {
            return new List<EmotionCategoryDto>();
        }

        results = Filter.FilterResultsByTimeRange(results, timeRangeDto);

        return Generator.GenerateEmotionCategories(results);
    }

    public async Task<IEnumerable<EmotionCategoryDto>> GetEmotionCategoriesForManager(Guid managerId, TimeRangeDto timeRangeDto)
    {
        var team = await _teamRepository.GetTeamByManagerIdAsync(managerId);
        if (team == null)
        {
            return new List<EmotionCategoryDto>();
        }

        return await GetEmotionCategoriesForTeam(team.Id, timeRangeDto);
    }
}