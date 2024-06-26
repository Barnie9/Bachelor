using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models;
using Services;

namespace API;

[Route("api/[controller]")]
[ApiController]
public class EmotionPercentageController : ControllerBase
{
    private readonly IEmotionPercentageService _emotionPercentageService;

    public EmotionPercentageController(IEmotionPercentageService emotionPercentageService)
    {
        _emotionPercentageService = emotionPercentageService;
    }

    [HttpPost("employee/{employeeId}")]
    public async Task<ActionResult<IEnumerable<EmotionPercentageDto>>> GetEmotionPercentagesForEmployee(
        [FromRoute] Guid employeeId, [FromBody] TimeRangeDto timeRangeDto)
    {
        var emotionPercentages =
            await _emotionPercentageService.GetEmotionPercentagesForEmployee(employeeId, timeRangeDto);

        return Ok(emotionPercentages);
    }

    [HttpPost("team/{teamId}")]
    public async Task<ActionResult<IEnumerable<EmotionPercentageDto>>> GetEmotionPercentagesForTeam(
        [FromRoute] Guid teamId, [FromBody] TimeRangeDto timeRangeDto)
    {
        var emotionPercentages = await _emotionPercentageService.GetEmotionPercentagesForTeam(teamId, timeRangeDto);

        return Ok(emotionPercentages);
    }

    [HttpPost("manager/{managerId}")]
    public async Task<ActionResult<IEnumerable<EmotionPercentageDto>>> GetEmotionPercentagesForManager(
        [FromRoute] Guid managerId, [FromBody] TimeRangeDto timeRangeDto)
    {
        var emotionPercentages =
            await _emotionPercentageService.GetEmotionPercentagesForManager(managerId, timeRangeDto);

        return Ok(emotionPercentages);
    }
}

