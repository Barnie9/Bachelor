using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models;
using Services;

namespace API;

[Route("api/[controller]")]
[ApiController]
public class PredictorController : ControllerBase
{
    private readonly IPredictorService _predictorService;

    public PredictorController(IPredictorService predictorService)
    {
        _predictorService = predictorService;
    }

    [HttpPost]
    public async Task<IActionResult> PredictAsync([FromBody] ImageDetailsDto imageDetailsDto)
    {
        var result = await _predictorService.PredictAsync(imageDetailsDto);

        if (result == false)
        {
            return BadRequest();
        }

        return Ok();
    }
}

