using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models;
using Services;

namespace API;

[Route("api/[controller]")]
[ApiController]
public class EmotionDayLevelController : ControllerBase
{
    private readonly IEmotionDayLevelService _emotionDayLevelService;

    public EmotionDayLevelController(IEmotionDayLevelService emotionDayLevelService)
    {
        _emotionDayLevelService = emotionDayLevelService;
    }

    [HttpPost("{emotionName}/employee/{employeeId}")]
    public async Task<ActionResult<IEnumerable<EmotionDayLevelDto>>> GetEmotionDayLevelsForEmployee([FromRoute] string emotionName, [FromRoute] Guid employeeId, [FromBody] TimeRangeDto timeRangeDto)
    {
        var emotionDayLevels = await _emotionDayLevelService.GetEmotionDayLevelsForEmployee(emotionName, employeeId, timeRangeDto);

        return Ok(emotionDayLevels);
    }

    [HttpPost("{emotionName}/team/{teamId}")]
    public async Task<ActionResult<IEnumerable<EmotionDayLevelDto>>> GetEmotionDayLevelsForTeam([FromRoute] string emotionName, [FromRoute] Guid teamId, [FromBody] TimeRangeDto timeRangeDto)
    {
        var emotionDayLevels = await _emotionDayLevelService.GetEmotionDayLevelsForTeam(emotionName, teamId, timeRangeDto);

        return Ok(emotionDayLevels);
    }

    [HttpPost("{emotionName}/manager/{managerId}")]
    public async Task<ActionResult<IEnumerable<EmotionDayLevelDto>>> GetEmotionDayLevelsForManager([FromRoute] string emotionName, [FromRoute] Guid managerId, [FromBody] TimeRangeDto timeRangeDto)
    {
        var emotionDayLevels = await _emotionDayLevelService.GetEmotionDayLevelsForManager(emotionName, managerId, timeRangeDto);

        return Ok(emotionDayLevels);
    }
}

