using Models;

namespace Services;

public interface IEmotionPercentageService
{
    Task<IEnumerable<EmotionPercentageDto>> GetEmotionPercentagesForEmployee(Guid employeeId, TimeRangeDto timeRangeDto);
    Task<IEnumerable<EmotionPercentageDto>> GetEmotionPercentagesForTeam(Guid teamId, TimeRangeDto timeRangeDto);
    Task<IEnumerable<EmotionPercentageDto>> GetEmotionPercentagesForManager(Guid managerId, TimeRangeDto timeRangeDto);
}