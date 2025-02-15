using HealthCareApplication.Contract.IService;
using HealthCareApplication.Dtos.AvailabilityDto;
using HealthCareApplication.Dtos.CommentDto;
using HealthCareApplication.Dtos.UserDto;
using HealthCareApplication.Dtos.UserDtoo;
using HealthCareDomain.IServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HealthCareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService _doctorService;
        private readonly IDoctorAvailabiltyService _doctorAvailabiltyService;

        public DoctorController(IDoctorService doctorService, IDoctorAvailabiltyService doctorAvailabiltyService)
        {
            _doctorService = doctorService;
            _doctorAvailabiltyService = doctorAvailabiltyService;
        }

        [HttpPost("AddProfile")]
        public async Task<IActionResult> AddAdditionalInfo(AddProfileDto addProfileDto)
        {
            var response = await _doctorService.AddProfileDetails(addProfileDto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("SearchDoctor")]
        public async Task<IActionResult> SearchDoctor([FromQuery] SearchDto searchDto) 
        {
            if (searchDto == null || string.IsNullOrEmpty(searchDto.Speciality) || string.IsNullOrEmpty(searchDto.Location))
            {
                return BadRequest("Specialty and Location are required for the search.");
            }

            var response = await _doctorService.SearchDoctorAsync(searchDto);

            if (response != null && response.Any()) 
            {
                return Ok(response);
            }

            return NotFound();
        }

        [HttpPost("GenerateAvailability")]

        public async Task <IActionResult> SaveAvailability(DoctorAvailabilityDto doctorAvailabilityDto)
        {
            var response = await _doctorAvailabiltyService.GenerateSlotsAsync(doctorAvailabilityDto);
            return StatusCode(response.StatusCode, response);

        }

        [HttpGet("GetDoctorDetails/{id}")]
        public async Task<IActionResult> GetDoctorDetails(string id)
        {
            var response = await _doctorService.GetDoctorDetails(id);

            if (response != null)
            {
                return Ok(response);
            }

            return NotFound();


        }

        [HttpGet("GetDoctorAvailability/{id}")]

        public async Task<IActionResult> GetDoctorAvaliability(string id)
        {
            var response = await _doctorAvailabiltyService.GetAvailabilityAsync(id);

            if (response.Count <= 0)
            {
                return BadRequest(new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "No SLots Available.",
                    StatusCode = 400
                });
            }


            return Ok(response);
            
           

        }

        [HttpPost("AddDoctorAdditionalInfo")]
        public async Task<IActionResult> PostDoctorAdditionalInfo([FromBody] AdditionalnfoDto request)
        {
            // Validate request before proceeding
            if (request == null || !request.Experiences.Any() || !request.Trainings.Any())
            {
                return BadRequest(new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "Experiences and Trainings cannot be empty.",
                    StatusCode = 400
                });
            }

            // Create or update doctor additional info
            var response = await _doctorService.CreateOrUpdateDoctorAdditionalInfo(request);
            return StatusCode(response.StatusCode, response);
        }

        //After Login

        [HttpGet("GetLoginDoctorData")]
        [Authorize(AuthenticationSchemes = "Bearer")]

        public async Task<IActionResult> GetLoginDoctorData()
        {
            var user = HttpContext.User.FindFirst("userId");

            var userId = user?.Value;

            var response = await _doctorService.GetLoginDoctorService(userId);

            if (response != null)
            {
                return Ok(response);
            }

            return NotFound();

        }

        [HttpPost("DoComment")]
        [Authorize(AuthenticationSchemes = "Bearer")]

        public async Task<IActionResult> DoComment(CommentDtoo comment)
        {
            var response = await _doctorService.DoCommentAsync(comment);
            if (response != null)
            {
                return Ok(response);
            }

            return NotFound();
        }

        [HttpGet("GetComments/{id}")]

        public async Task <IActionResult> GetComment(string id)
        {
            var response = await _doctorService.GetCommentsAsync(id);
            if(response != null)
            {
                return Ok(response);
            }
            return NotFound();
        }

        [HttpGet("DoctorRevenue")]
        [Authorize(AuthenticationSchemes = "Bearer")]

        public async Task <IActionResult> GetDoctorRevenue()
        {
            var user = HttpContext.User.FindFirst("userId");

            var userId = user?.Value;

            var response = await _doctorService.GetDoctorRevenueAsync(userId);

            if (response != null)
            {
                return Ok(response);
            }

            return NotFound();

        }

    }
}
