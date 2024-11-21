using HealthCareApplication.Contract.IService;
using HealthCareApplication.Dtos.AvailabilityDto;

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


        [HttpPost ("BookAppointment")]
        public async Task<IActionResult> BookAppointment(AppointmentDto appointmentDto)
        {
            var response = await _appointmentService.BookAppointmentAsync(appointmentDto);

            return StatusCode(response.StatusCode, response);
        }

    }
}
