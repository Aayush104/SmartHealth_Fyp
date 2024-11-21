using Azure;
using HealthCareDomain.IServices;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class DoctorController : ControllerBase
{
    private readonly IAdminService _adminService;

    public DoctorController(IAdminService adminService)
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

}
