using HealthCareApplication.Contract.IService;

using HealthCareApplication.Dtos.UserDto;
using HealthCareApplication.Dtos.UserDtoo;
using HealthCareDomain.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthCareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IAuthService _userService;
        private readonly IOtpService _otpService;

        public UserController(IAuthService userService, IOtpService otpService)
        {
            _userService = userService;
            _otpService = otpService;
        }

        [HttpPost("RegisterPatient")]
        public async Task<IActionResult> RegisterPatient(PatientDto patientDto)
        {
            var response = await _userService.AddUserAsync(patientDto, "Patient", patientDto);

            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("RegisterDoctor")]
        public async Task<IActionResult> RegisterDoctor(DoctorDto doctorDto)
        {
            var response = await _userService.AddUserAsync(doctorDto, "Doctor", doctorDto);

            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("VerifyOtp")]
        public async Task<IActionResult> VerifyOtp(OtpVerificationDto otpVerification)
        {
            var isValidOtp = await _otpService.verifyOtpAsync(otpVerification.UserId, otpVerification.Otp, otpVerification.Purpose);

            if (isValidOtp)
            {
                var response = new ApiResponseDto
                {
                    IsSuccess = true,
                    StatusCode = StatusCodes.Status200OK,
                    Message = "OTP verified successfully."
                };

                return Ok(response);
            }

            var errorResponse = new ApiResponseDto
            {
                IsSuccess = false,
                StatusCode = StatusCodes.Status400BadRequest,
                Message = "Invalid or expired OTP."
            };

            return BadRequest(errorResponse);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var response = await _userService.LoginUserAsync(loginDto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword(ForgetPasswordDto forgotPasswordDto)
        {
            var response = await _userService.ForgotPasswordAsync(forgotPasswordDto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var response = await _userService.ChangePasswordAsync(changePasswordDto);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("ResendOtp/{userId}/{purpose}")]

        public async Task<IActionResult> ResendOtp(string userId, string purpose)
        {
            var response = await _userService.ResendOtpAsync(userId, purpose);
            return StatusCode(response.StatusCode, response);   

        }
        [HttpPost("GoogleLogin")]
        public async Task<IActionResult> GoogleLogin(GoogleLoginDto googleLoginDto)
        {
            var response = await _userService.GoogleLoginAsync(googleLoginDto);
          

            return StatusCode(response.StatusCode, response);
        }

    }
}
