using Models;

namespace Services;

public interface IEmotionCategoryService
{
    Task<IEnumerable<EmotionCategoryDto>> GetEmotionCategoriesForEmployee(Guid employeeId, TimeRangeDto timeRangeDto);
    Task<IEnumerable<EmotionCategoryDto>> GetEmotionCategoriesForTeam(Guid teamId, TimeRangeDto timeRangeDto);
    Task<IEnumerable<EmotionCategoryDto>> GetEmotionCategoriesForManager(Guid managerId, TimeRangeDto timeRangeDto);
}