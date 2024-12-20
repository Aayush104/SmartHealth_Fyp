using HealthCareApplication.Contract.IService;
using HealthCareApplication.Dtos.AvailabilityDto;
using HealthCareApplication.Dtos.UserDto;
using HealthCareDomain.IServices;
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

            if (response != null)
            {
                return Ok(response);
            }

            return NotFound();

        }

    }
}
