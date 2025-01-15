using Azure;
using HealthCareApplication.Contract.IService;
using HealthCareApplication.Dtos.AvailabilityDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthCareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        public AppointmentController(IAppointmentService appointmentService)

        {
            _appointmentService = appointmentService;
        }


        [HttpPost("BookAppointment")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> BookAppointment(AppointmentDto appointmentDto)
        {
            var user = HttpContext.User.FindFirst("userId");

            var userId = user?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found");
            }

            var response = await _appointmentService.BookAppointmentAsync(appointmentDto, userId!);

            return StatusCode(response.StatusCode, response);
        }


        [HttpGet("GetAppointmentList")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> GetAppointmentList()
        {
            var user = HttpContext.User.FindFirst("userId");

            var userId = user?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found");
            }

        var response = await _appointmentService.GetAppointmentListAsync(userId);

            return Ok(response);
        }
    }
}
