using Azure.Core;
using Google.Apis.Auth;
using HealthCareApplication.Contract.IService;
using HealthCareApplication.Contracts.Email;
using HealthCareApplication.Contracts.IService;

using HealthCareApplication.Dtos.UserDto;
using HealthCareApplication.Dtos.UserDtoo;
using HealthCareApplication.Helper;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Patients;
using HealthCareDomain.Entity.UserEntity;
using HealthCareDomain.IServices;
using HealthCareInfrastructure.DataSecurity;
using HealthCarePersistence.IRepository;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;

using System.Threading.Tasks;
using System.Text.Json;

using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Security.Claims;

namespace HealthCareApplication.Features.Services
{
    public class AuthService : IAuthService
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IDoctorRepository _doctorRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IMailService _mailService;
        private readonly IFileService _fileService;
        private readonly IOtpService _otpService;
        private readonly ITokenService _tokenService;
        private readonly IDataProtector _dataProtector;
        private readonly HttpClient _httpClient;

        public AuthService( HttpClient httpclient, IPatientRepository patientRepository, IDoctorRepository doctorRepository, UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager, IFileService fileService, IMailService mailService, IOtpService otpService,
            ITokenService tokenService, IDataProtectionProvider dataProtector, DataSecurityProvider securityProvider)
        {
            _httpClient = httpclient;   
            _patientRepository = patientRepository;
            _doctorRepository = doctorRepository;
            _userManager = userManager;
            _signInManager = signInManager;
            _fileService = fileService;
            _fileService = fileService;
            _mailService = mailService;
            _otpService = otpService;
            _tokenService = tokenService;
            _dataProtector = dataProtector.CreateProtector(securityProvider.securityKey);
        }

        public async Task<ApiResponseDto> AddUserAsync(UserDto userDto, string role, object UserTypeDetails = null)
        {
            try
            {
                var existingEmail = await _userManager.FindByEmailAsync(userDto.Email);
                if (existingEmail != null)
                {
                    return new ApiResponseDto { IsSuccess = false, Message = "A user with this email already exists.", StatusCode = 400 };
                }
            

                var otp = OtpGenerator.GenerateOtp();
                var user = new ApplicationUser
                {
                    FullName = userDto.FullName,
                    Email = userDto.Email,
                    UserName = userDto.Email,
                    PhoneNumber = userDto.PhoneNumber
                };

                var result = await _userManager.CreateAsync(user, userDto.Password);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, role);

                    if (role == "Patient" && UserTypeDetails is PatientDto patientDto)
                    {
                        var patient = new Patient
                        {
                            Id = user.Id,
                            DateOfBirth = patientDto.DateOfBirth,
                           Gender = patientDto.Gender,
                           Address = patientDto.Address

                        };
                        await _patientRepository.AddPatient(patient);
                        await _otpService.StoreOtpAsync(user.Id, "Registration", otp);
                        await _mailService.SendEmail(user.Email,user.FullName, otp);
                    }
                    else if (role == "Doctor" && UserTypeDetails is DoctorDto doctorDto)
                    {
                        var license = await _fileService.SaveFileAsync(doctorDto.LicenseFile, "Liscense");
                        var government = await _fileService.SaveFileAsync(doctorDto.GovernmentIdFile, "Government");
                        var qualification = await _fileService.SaveFileAsync(doctorDto.QualificationsFile, "Qualification");

                        var doctor = new Doctor
                        {
                            Id = user.Id,
                            LicenseFilePath = license,
                            Location = doctorDto.Location,
                            GovernmentIdFilePath = government,
                            QualificationsFilePath = qualification,
                            Specialization = doctorDto.Specialization,
                            Qualifications = doctorDto.Qualifications,
                            LicenseNumber = doctorDto.LicenseNumber,
                            Status = "Pending",
                        };

                        await _doctorRepository.AddDoctor(doctor);
                        return new ApiResponseDto { IsSuccess = true, Message = "We will send you an email for verification soon.", StatusCode = 200 };
                    }

                    return new ApiResponseDto { IsSuccess = true, Message = "User created successfully.", StatusCode = 201, Data = _dataProtector.Protect(user.Id) };
                }

                return new ApiResponseDto { IsSuccess = false, Message = "Failed to create user.", StatusCode = 500 };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto { IsSuccess = false, Message = ex.Message, StatusCode = 500 };
            }
        }

        public async Task<ApiResponseDto> LoginUserAsync(LoginDto loginDto)
        {
            try
            {
                var existingUser = await _userManager.FindByEmailAsync(loginDto.Email);

                if (existingUser == null)
                {
                    return new ApiResponseDto { IsSuccess = false, Message = "User is not registered", StatusCode = 404 };
                }

                var verifyExistingUser = await _userManager.CheckPasswordAsync(existingUser, loginDto.Password);

                if (!verifyExistingUser)
                {
                    return new ApiResponseDto { IsSuccess = false, Message = "Password is incorrect", StatusCode = 404 };
                }

                var userRole = await _userManager.GetRolesAsync(existingUser);
                var role = userRole.FirstOrDefault();

                if (existingUser.IsBlocked)
                {
                    return new ApiResponseDto { IsSuccess = false, Message = "You have been banned", StatusCode = 403 };
                }


                if (!existingUser.EmailConfirmed && role == "Patient")
                {
                    var otp = OtpGenerator.GenerateOtp();
                    await _otpService.StoreOtpAsync(existingUser.Id, "Registration", otp);
                    await _mailService.SendEmail(existingUser.Email, existingUser.FullName, otp);
                    return new ApiResponseDto { IsSuccess = false, Message = _dataProtector.Protect(existingUser.Id), StatusCode = 401 };
                }
                else if (!existingUser.EmailConfirmed && role == "Doctor")
                {
                    return new ApiResponseDto { IsSuccess = false, Message = "Check your email If our Team Has Send You a verification Link", StatusCode = 404 };
                }
                else
                {
                    var token = _tokenService.GenerateToken(existingUser, userRole.ToList());
                    return token != null
                        ? new ApiResponseDto { IsSuccess = true, Message = "Login successful", StatusCode = 200, Data = token }
                        : new ApiResponseDto { IsSuccess = false, Message = "An internal error occurred", StatusCode = 500 };
                }
            }
            catch (Exception ex)
            {
                return new ApiResponseDto { IsSuccess = false, Message = "An error occurred during login", StatusCode = 500, Data = ex.Message };
            }
        }

        public async Task<ApiResponseDto> ForgotPasswordAsync(ForgetPasswordDto forgetPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(forgetPasswordDto.Email);

            if (user == null)
            {
                return new ApiResponseDto { IsSuccess = false, Message = "The user does not exist", StatusCode = 404 };
            }

            var otp = OtpGenerator.GenerateOtp();
            await _otpService.StoreOtpAsync(user.Id, "ForgetPassword", otp);
            await _mailService.SendEmail(forgetPasswordDto.Email, user.FullName, otp);

            return new ApiResponseDto { IsSuccess = true, Message = "OTP sent to email", StatusCode = 200, Data = _dataProtector.Protect(user.Id) };
        }

        public async Task<ApiResponseDto> ChangePasswordAsync(ChangePasswordDto changePasswordDto)
        {
            try
            {
                var unhashedUserId = _dataProtector.Unprotect(changePasswordDto.userId);
                var user = await _userManager.FindByIdAsync(unhashedUserId);

                if (user == null)
                {
                    return new ApiResponseDto { IsSuccess = false, Message = "The user does not exist", StatusCode = 404 };
                }

                var removePasswordResult = await _userManager.RemovePasswordAsync(user);
                if (!removePasswordResult.Succeeded)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = "Failed to remove the current password",
                        StatusCode = 500,
                        Data = removePasswordResult.Errors.Select(e => e.Description)
                    };
                }

                var addPasswordResult = await _userManager.AddPasswordAsync(user, changePasswordDto.Password);
                if (!addPasswordResult.Succeeded)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = "Failed to add the new password",
                        StatusCode = 500,
                        Data = addPasswordResult.Errors.Select(e => e.Description)
                    };
                }

                return new ApiResponseDto { IsSuccess = true, Message = "Password updated successfully", StatusCode = 200 };
            }
            catch (FormatException ex)
            {
                return new ApiResponseDto { IsSuccess = false, Message = "Invalid user ID format", StatusCode = 400, Data = ex.Message };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto { IsSuccess = false, Message = "An error occurred while updating the password", StatusCode = 500, Data = ex.Message };
            }
        }

        public async Task<ApiResponseDto> ResendOtpAsync(string userId, string purpose)
        {
            try
            {

                var otp = OtpGenerator.GenerateOtp();

                var unhashedId = _dataProtector.Unprotect(userId);  

                var user = await _userManager.FindByIdAsync(unhashedId);

                if (user == null)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = "User not found.",
                        StatusCode = 404
                    };
                }

                await _otpService.StoreOtpAsync(unhashedId, purpose, otp);

                await _mailService.SendEmail(user.Email, user.FullName, otp);


                return new ApiResponseDto
                {
                    IsSuccess = true,
                    Message = "OTP resent successfully.",
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {


                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "An error occurred while resending OTP. Please try again later.",
                    StatusCode = 500
                };
            }
        }

        public async Task<ApiResponseDto> GoogleLoginAsync(GoogleLoginDto googleLoginDto)
        {
            try
            {
               
                var user = await _userManager.FindByEmailAsync(googleLoginDto.Email);

                if (user !=null && user.IsBlocked)
                {
                    return new ApiResponseDto { IsSuccess = false, Message = "You have been banned", StatusCode = 403 };
                }


                if (user == null)
                {
                    user = new ApplicationUser
                    {
                        FullName = googleLoginDto.Name,
                        Email = googleLoginDto.Email,
                        UserName = googleLoginDto.Email,
                        EmailConfirmed = true
                    };

                  
                    var result = await _userManager.CreateAsync(user);
                    if (!result.Succeeded)
                    {
                       
                        return new ApiResponseDto
                        {
                            IsSuccess = false,
                            Message = "Error registering user.",
                            StatusCode = 400  
                        };
                    }

                    await _userManager.AddToRoleAsync(user, "Patient");

                    
                    var patient = new Patient { Id = user.Id };
                    await _patientRepository.AddPatient(patient);
                }

               
                var userRole = await _userManager.GetRolesAsync(user);

                
            
                var token = _tokenService.GenerateToken(user, userRole.ToList());

                if (token != null)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = true,
                        Message = "Login successful",
                        StatusCode = 200,
                        Data = token
                    };
                }
                else
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = "Token generation failed.",
                        StatusCode = 500
                    };
                }
            }
            catch (Exception ex)
            {
                // Catch any unexpected errors
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = $"Internal server error: {ex.Message}",
                    StatusCode = 500
                };
            }
        }

        public async Task<ApiResponseDto> CheckIsStatus(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return new ApiResponseDto { IsSuccess = false, Message = "User not found" };
            }

            if (!user.EmailConfirmed || user.IsBlocked)
            {
                return new ApiResponseDto { IsSuccess = false, Message = "User is either not confirmed or blocked" };
            }

            return new ApiResponseDto { IsSuccess = true, Message = "User is active" };
        }

    }
}
