using HealthCareApplication.Contract.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthCareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }


        [HttpGet("CheckAccess")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task <IActionResult> CheckAccess()
        {
            var user = HttpContext.User.FindFirst("userId");

            var userId = user?.Value;

            var response = await _authService.CheckIsStatus(userId);

            if(!response.IsSuccess)
            {
                return Ok("Forbidden");
            }
           
            return Ok(userId);
        }

      
    }
}
