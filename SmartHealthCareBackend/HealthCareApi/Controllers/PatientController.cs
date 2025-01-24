using HealthCareApplication.Contract.IService;
using HealthCareApplication.Dtos.UserDtoo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthCareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {

        private readonly IPatientService _patientService;
        public PatientController(IPatientService patientService)
        {
        _patientService = patientService;
        }

        [HttpPost("AddPatientDetails")]
        [Authorize(AuthenticationSchemes = "Bearer")]

        public async Task<IActionResult> AddPatientDetails(AddPatientDetailsDto addPatientDetailsDto)
        {
            var user = HttpContext.User.FindFirst("userId");

            var userId = user?.Value;

            var response = await _patientService.AddPatientDetailsAsync(addPatientDetailsDto, userId);

            return StatusCode(response.StatusCode, response);

        }


        [HttpGet("GetPatientDetails")]
        [Authorize(AuthenticationSchemes = "Bearer")]

        public async Task<IActionResult> GetPatientDetails()
        {
            var user = HttpContext.User.FindFirst("userId");

            var userId = user?.Value;

            var response = await _patientService.GetPatientDetailsAsync(userId);

            if (response != null)
            {
                return Ok(response);
            }

            return NotFound();
        }

    }
}
