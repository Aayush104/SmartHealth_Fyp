using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthCareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public AuthController() { }


        [HttpGet("CheckAccess")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task <IActionResult> CheckAccess()
        {
            var user = HttpContext.User.FindFirst("userId");

            var userId = user?.Value;

            return Ok(userId);
        }

      
    }
}
