using Azure;
using HealthCareApplication.Dtos.AnnouncementDto;
using HealthCareApplication.Dtos.ReportDto;
using HealthCareDomain.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using static Google.Apis.Requests.BatchRequest;

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

        [HttpGet("GetDoctors")]

        public async Task<IActionResult> GetDoctors()
        {
            var response = await _adminService.GetAllVerifiedDoctorAsync();
            return Ok(response);
        }

        [HttpPost("Block/{userId}")]

        public async Task<IActionResult> BlockUser(string userId)
        {
            var response = await _adminService.BlockUserAsync(userId);
            return StatusCode(response.StatusCode, response);   
        }
        [HttpPost("BlockDoctor/{userId}")]
        public async Task<IActionResult> BlockDoctor(string userId)
        {
            var response = await _adminService.BlockDoctorAsync(userId);
            return StatusCode(response.StatusCode, response);   
        } 
        
        [HttpPost("Unblock/{userId}")]
        public async Task<IActionResult> Unblock(string userId)
        {
            var response = await _adminService.UnBlockUserAsync(userId);
            return StatusCode(response.StatusCode, response);   
        } 
        
        [HttpPost("UnblockDoctor/{userId}")]
        public async Task<IActionResult> UnblockDoctor(string userId)
        {
            var response = await _adminService.UnBlockDoctorAsync(userId);
            return StatusCode(response.StatusCode, response);   
        }


        [HttpGet("GetAllBookings")]
         public async Task<IActionResult> GetAllBookings()
        {
            var response = await _adminService.GetAllBookingAsync();
            return StatusCode(response.StatusCode, response);
        }  
        
        [HttpPost("DoAnnouncement")]
         public async Task<IActionResult> DoAnnouncement(AnnounceDto announceDto)
        {
            var response = await _adminService.DoAnnouncementAsync(announceDto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("DeleteComment/{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var response = await _adminService.DeleteCommentAsync(id);
            return StatusCode(response.StatusCode, response);
        }


        [HttpGet("GetAnnouncementNotification")]
        public async Task<IActionResult> GetAnnouncemnt()
        {
            var response = await _adminService.GetAnnouncementNotificationAsync();
            if (response != null)
            {
                return Ok(response);
            }

            return NotFound();
        }


        [HttpGet("MarkAllAnnouncementAsRead")]
      
        public async Task<IActionResult> MarklNotificaionsAsRead()
        {
          

            var response = await _adminService.MarkNotificationAsReadAsync();

            if (response != null)
            {
                return Ok(response);
            }

            return NotFound();

        }

        [HttpPost ("DoReport")]

        public async Task<IActionResult> DoReport(ReportDto reportDto)
        {
            var response = await _adminService.DoReportAsync(reportDto);
            return StatusCode(response.StatusCode, response);
        }
    }
}