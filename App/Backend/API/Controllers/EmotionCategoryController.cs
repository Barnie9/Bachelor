using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models;
using Services;

namespace API;

[Route("api/[controller]")]
[ApiController]
public class EmotionCategoryController : ControllerBase
{
    private readonly IEmotionCategoryService _emotionCategoryService;

    public EmotionCategoryController(IEmotionCategoryService emotionCategoryService)
    {
        _emotionCategoryService = emotionCategoryService;
    }

    [HttpPost("employee/{employeeId}")]
    public async Task<ActionResult<IEnumerable<EmotionCategoryDto>>> GetEmotionCategoriesForEmployee([FromRoute] Guid employeeId, [FromBody] TimeRangeDto timeRangeDto)
    {
        var emotionCategories = await _emotionCategoryService.GetEmotionCategoriesForEmployee(employeeId, timeRangeDto);

        return Ok(emotionCategories);
    }

    [HttpPost("team/{teamId}")]
    public async Task<ActionResult<IEnumerable<EmotionCategoryDto>>> GetEmotionCategoriesForTeam([FromRoute] Guid teamId, [FromBody] TimeRangeDto timeRangeDto)
    {
        var emotionCategories = await _emotionCategoryService.GetEmotionCategoriesForTeam(teamId, timeRangeDto);

        return Ok(emotionCategories);
    }

    [HttpPost("manager/{managerId}")]
    public async Task<ActionResult<IEnumerable<EmotionCategoryDto>>> GetEmotionCategoriesForManager([FromRoute] Guid managerId, [FromBody] TimeRangeDto timeRangeDto)
    {
        var emotionCategories = await _emotionCategoryService.GetEmotionCategoriesForManager(managerId, timeRangeDto);

        return Ok(emotionCategories);
    }
}

