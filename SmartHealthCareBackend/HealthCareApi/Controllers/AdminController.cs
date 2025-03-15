using Azure;
using HealthCareDomain.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HealthCareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("VerifyDoctor")]
        public async Task<IActionResult> VerifyDoctors()
        {
            var doctors = await _adminService.GetAllDoctorsAsync();

            if (doctors == null || !doctors.Any())
            {
                return NotFound(new { message = "No doctors available." });
            }

            return Ok(doctors);
        }

        [HttpPost("AcceptDoctor/{email}")]

        public async Task<IActionResult> AcceptDoctor(string email)
        {
            var response = await _adminService.AcceptDoctorAsync(email);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("RejectDoctor/{email}")]

        public async Task<IActionResult> RejectDoctor(string email)
        {
            var response = await _adminService.RejectDoctorAsync(email);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("ConfirmDoctorEmail/{email}/{otp}")]

        public async Task<IActionResult> ConfirmDoctorEmail(string email, string otp)
        {
            var response = await _adminService.ConfirmDoctorEmailAsync(email, otp);

            return StatusCode(response.StatusCode, response);
        }


        [HttpGet("GetUsers")]

        public async Task<IActionResult> GetUsers()
        {
            var response = await _adminService.GetAllPatientAsync();
            return StatusCode(response.StatusCode, response);
        }
    }
}