using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models;
using Services;

namespace API;

[Route("api/[controller]")]
[ApiController]
public class ManagerController : ControllerBase
{
    private readonly IManagerService _managerService;

    public ManagerController(IManagerService managerService)
    {
        _managerService = managerService;
    }

    [HttpPost("{email}")]
    public async Task<ActionResult<ManagerDto>> GetManagerByEmailAsync([FromRoute] string email)
    {
        var manager = await _managerService.GetManagerByEmailAsync(email);
        if (manager == null)
        {
            return NotFound();
        }

        return Ok(manager);
    }
}
