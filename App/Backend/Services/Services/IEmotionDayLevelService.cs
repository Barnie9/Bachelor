using Models;

namespace Services;

public interface IEmotionDayLevelService
{
    Task<IEnumerable<EmotionDayLevelDto>> GetEmotionDayLevelsForEmployee(string emotionName, Guid employeeId, TimeRangeDto timeRangeDto);
    Task<IEnumerable<EmotionDayLevelDto>> GetEmotionDayLevelsForTeam(string emotionName, Guid teamId, TimeRangeDto timeRangeDto);
    Task<IEnumerable<EmotionDayLevelDto>> GetEmotionDayLevelsForManager(string emotionName, Guid managerId, TimeRangeDto timeRangeDto);
}