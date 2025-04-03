using HealthCareApplication.Contracts.Email;
using HealthCareApplication.Contracts.IService;
using HealthCareApplication.Dtos.AnnouncementDto;
using HealthCareApplication.Dtos.CommentDto;
using HealthCareApplication.Dtos.ReportDto;
using HealthCareApplication.Dtos.UserDto;
using HealthCareApplication.Helper;
using HealthCareApplication.NotificationHub;
using HealthCareApplication.StatusHub;
using HealthCareDomain.Entity.Announcement;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Reporting;
using HealthCareDomain.Entity.UserEntity;
using HealthCareDomain.IRepository;
using HealthCareDomain.IServices;
using HealthCareInfrastructure.DataSecurity;
using HealthCarePersistence.IRepository;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;

namespace HealthCareApplication.Features.Services;

public class AdminService : IAdminService
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly IAdminRepository _adminRepository;
        private readonly UserManager<ApplicationUser> _userManager;
    private readonly IHubContext<UserHub> _hubContext;

    private readonly IHubContext<Notificationhub> _Context;
    private readonly IMailService _mailService;
    private readonly IOtpService _otpService;
    private readonly IDataProtector _dataProtector;
    private readonly IFileService _fileService;


    public AdminService(IDoctorRepository doctorRepository, UserManager<ApplicationUser> userManager, IMailService mailService,IOtpService otpService, 
     IDataProtectionProvider dataProtection, DataSecurityProvider securityProvider, IAdminRepository adminRepository, IHubContext<UserHub> hubContext, IHubContext<Notificationhub> Context, IFileService fileService)
        {
            _doctorRepository = doctorRepository;
            _userManager = userManager;
        _mailService = mailService; 
        _otpService = otpService;
        _adminRepository = adminRepository;
        _hubContext = hubContext;
        _Context = Context;
        _fileService = fileService;
        _dataProtector = dataProtection.CreateProtector(securityProvider.securityKey);
        }

    public async Task<ApiResponseDto> AcceptDoctorAsync(string email)
    {
        
        var checkEmail = await _userManager.FindByEmailAsync(email);

        if (checkEmail == null)
        {
            return new ApiResponseDto { IsSuccess = false, Message = "User doesn't exist", StatusCode = 400 };
        }

       
        var otp = OtpGenerator.GenerateOtp();

        var doctor = await _doctorRepository.GetDoctorBYId(checkEmail.Id);

        if (doctor == null)
        {
            return new ApiResponseDto { IsSuccess = false, Message = "Doctor record not found", StatusCode = 404 };
        }


        doctor.Status = "Accepted";
        await _doctorRepository.UpdateDoctorAsync(doctor);
        await _otpService.StoreOtpAsync(checkEmail.Id, "Registration", otp);
        await _mailService.SendDoctorAcceptanceEmail(email, checkEmail.FullName, _dataProtector.Protect(otp));
        

        

        return new ApiResponseDto { IsSuccess = true, Message = "Doctor Accepted", StatusCode = 200 };
    }

    public async Task<ApiResponseDto> ConfirmDoctorEmailAsync(string email, string otp)
    {
        
        if (email == null || otp == null)
        {
            return new ApiResponseDto { IsSuccess = false, Message = "Credentials Not Found", StatusCode = 404 };
        }

    
        var checkEmail = await _userManager.FindByEmailAsync(email);

     
        if (checkEmail == null)
        {
            return new ApiResponseDto { IsSuccess = false, Message = "User not found", StatusCode = 404 };
        }

       
        var unhashedOtp = _dataProtector.Unprotect(otp);

       
        var userId = checkEmail.Id;
        var verifyEmail = await _otpService.VerifyDoctorOtpAsync(userId, unhashedOtp, "Registration");

     
        if (verifyEmail)
        {
            return new ApiResponseDto { IsSuccess = true, Message = "Email confirmed successfully", StatusCode = 200 };
        }
        else
        {
            return new ApiResponseDto { IsSuccess = false, Message = "OTP verification failed", StatusCode = 400 };
        }
    }

    public async Task<IEnumerable<DoctorDetailsDto>> GetAllDoctorsAsync()
        {
            try
            {
                var doctors = await _doctorRepository.GetAllDoctors();

                
                var doctorList = doctors.Select(doctor => new DoctorDetailsDto
                {
                    userId = _dataProtector.Protect(doctor.User.Id),
                    FullName = doctor.User.FullName, 
                    Email = doctor.User.Email,
                    Specialization = doctor.Specialization,
                 Profileget = doctor.Profile,
                    Qualifications = doctor.Qualifications,
                    Status = doctor.Status,
                   

                }).ToList();

                return doctorList;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching doctors.", ex);
            }
        }

    public async Task<ApiResponseDto> GetAllPatientAsync()
    {
        try
        {
            var patient = await _adminRepository.GetPatient();
           

            return new ApiResponseDto { IsSuccess = true, StatusCode = 200, Data= patient };
        }
        catch (Exception ex)
        {
            return new ApiResponseDto { IsSuccess = false, Message = "Failed to delete the user", StatusCode = 500 };

        }
    }

  

    public async Task<ApiResponseDto> RejectDoctorAsync(string email)
    {
        
        var checkEmail = await _userManager.FindByEmailAsync(email);
        if (checkEmail == null)
        {
            return new ApiResponseDto { IsSuccess = false, Message = "User not found", StatusCode = 400 };
        }

       
        await _mailService.SendDoctorRejectionEmail(email, checkEmail.FullName);

        // Delete the doctor
        var result = await _userManager.DeleteAsync(checkEmail);
        if (!result.Succeeded)
        {
            return new ApiResponseDto { IsSuccess = false, Message = "Failed to delete the user", StatusCode = 500 };
        }

        
        return new ApiResponseDto { IsSuccess = true, Message = "Doctor rejected and user deleted successfully", StatusCode = 200 };
    }

    public async Task<IEnumerable<DoctorDetailsDto>> GetAllVerifiedDoctorAsync()
    {
        try
        {
            var doctors = await _adminRepository.GetAllDoctors(); // Ensure this method is async

            return doctors.Select(doctor => new DoctorDetailsDto
            {
               Id = _dataProtector.Protect(doctor.User.Id),
                FullName = doctor.User.FullName,
                Email = doctor.User.Email,
                Specialization = doctor.Specialization,
                Profileget = doctor.Profile, // Assuming 'Profileget' was a typo
                Qualifications = doctor.Qualifications,
                Status = doctor.Status,
                IsBlocked = doctor.User.IsBlocked
            }).ToList();
        }
        catch (Exception ex)
        {
            
            throw;
        }
    }
    public async Task<ApiResponseDto> BlockUserAsync(string Id)
    {
        var response = await _adminRepository.BlockUserAsync(Id);

        if (response)
        {
            await _hubContext.Clients.Group(Id).SendAsync("Logout");
            return new ApiResponseDto { IsSuccess = true, Message = "User Blocked", StatusCode = 200 };
        }

        return new ApiResponseDto { IsSuccess = false, Message = "Failed to block user", StatusCode = 400 };
    }

    public async Task<ApiResponseDto> BlockDoctorAsync(string Id)
    {
        if(Id == null)
        {
            return new ApiResponseDto { IsSuccess = false, Message = "Id Not Found", StatusCode = 404 };
        }


        var userId = _dataProtector.Unprotect(Id);
        var response = await _adminRepository.BlockUserAsync(userId);

        if (response)
        {
            await _hubContext.Clients.Group(userId).SendAsync("Logout");
            return new ApiResponseDto { IsSuccess = true, Message = "User Blocked", StatusCode = 200 };
        }


        return new ApiResponseDto { IsSuccess = false, Message = "Failed to block user", StatusCode = 400 };
    }

    public async Task<ApiResponseDto> UnBlockUserAsync(string Id)
    {
        var response = await _adminRepository.UnBlockUserAsync(Id);

        if (response)
        {
            
            return new ApiResponseDto { IsSuccess = true, Message = "User UnBlocked", StatusCode = 200 };
        }

        return new ApiResponseDto { IsSuccess = false, Message = "Failed to Unblock user", StatusCode = 400 };
    }

    public async Task<ApiResponseDto> UnBlockDoctorAsync(string Id)
    {
        if (Id == null)
        {
            return new ApiResponseDto { IsSuccess = false, Message = "Id Not Found", StatusCode = 404 };
        }


        var userId = _dataProtector.Unprotect(Id);
        var response = await _adminRepository.UnBlockUserAsync(userId);
        if (response)
        {

            return new ApiResponseDto { IsSuccess = true, Message = "User UnBlocked", StatusCode = 200 };
        }

        return new ApiResponseDto { IsSuccess = false, Message = "Failed to Unblock user", StatusCode = 400 };
    }

    public async Task<ApiResponseDto> GetAllBookingAsync()
    {
        try
        {
            var response = await _adminRepository.GetAllAppointments();

            if (response != null && response.Any()) 
            {
                return new ApiResponseDto { IsSuccess = true, Data = response, StatusCode = 200 };
            }
            else
            {
                return new ApiResponseDto { IsSuccess = false, Message = "No appointments found", StatusCode = 404 };
            }
        }
        catch (Exception ex)
        {
            return new ApiResponseDto { IsSuccess = false, Message = $"An error occurred: {ex.Message}", StatusCode = 500 };
        }
    }

    public async Task<ApiResponseDto> DeleteCommentAsync(int Id)
    {
        if (Id == 0)
        {
            return new ApiResponseDto { IsSuccess = false, Message = "Id Not Found", StatusCode = 404 };
        }

        var response = await _adminRepository.DeleteCommentAsync(Id);

        if (response)
        {

            return new ApiResponseDto { IsSuccess = true, Message = "Comment deleted", StatusCode = 200 };
        }

        return new ApiResponseDto { IsSuccess = false, Message = "Failed to Unblock user", StatusCode = 400 };
    }


    // DoAnnouncementAsync with standardized notification format
    public async Task<ApiResponseDto> DoAnnouncementAsync(AnnounceDto announceDto)
    {
        if (announceDto == null)
        {
            return new ApiResponseDto
            {
                IsSuccess = false,
                Message = "Invalid announcement data.",
                StatusCode = 400
            };
        }

        var announce = new Announce
        {
            Title = announceDto.Title,
            Description = announceDto.Description,
            CreatedAt = DateTime.UtcNow
        };

        // Create a structured notification object
        var notificationObject = new
        {
            type = "announcement",
            content = $"{announceDto.Title}: {announceDto.Description}",
            id = Guid.NewGuid().ToString(),
            timestamp = DateTime.UtcNow,
            title = announceDto.Title,
            description = announceDto.Description
        };

        await _Context.Clients.All.SendAsync("ReceiveNotification", notificationObject);
        await _adminRepository.DoAnnounceAsync(announce);

        return new ApiResponseDto
        {
            IsSuccess = true,
            Message = "Announcement created successfully.",
            StatusCode = 200
        };
    }

    public async Task<ApiResponseDto> GetAnnouncementNotificationAsync()
    {
        try
        {
            var response = await _adminRepository.GetAllNotificationAsync();

            if (response != null && response.Any())
            {
                return new ApiResponseDto { IsSuccess = true, Data = response, StatusCode = 200 };
            }
            else
            {
                return new ApiResponseDto { IsSuccess = false, Message = "No appointments found", StatusCode = 404 };
            }
        }
        catch (Exception ex)
        {
            return new ApiResponseDto { IsSuccess = false, Message = $"An error occurred: {ex.Message}", StatusCode = 500 };
        }
    }

    public async Task<ApiResponseDto> MarkNotificationAsReadAsync()
    {
        try
        {
            var updateNotificationStatus = await _adminRepository.UpdateNotificationStatus();

            if (updateNotificationStatus)
            {
                return new ApiResponseDto
                {
                    IsSuccess = true,
                    Message = "Marked all as read",
                    StatusCode = 200
                };
            }

            return new ApiResponseDto
            {
                IsSuccess = false,
                Message = "No notifications found or update failed",
                StatusCode = 404
            };
        }
        catch (Exception ex)
        {
            return new ApiResponseDto
            {
                IsSuccess = false,
                Message = $"An error occurred: {ex.Message}",
                StatusCode = 500
            };
        }
    }

    public async Task<ApiResponseDto> DoReportAsync(ReportDto reportDto)
    {
        try
        {
            if (reportDto == null)
            {
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "No Data found",
                    StatusCode = 404
                };
            }

            string? photo = null; 

            if (reportDto.Photo != null)
            {
                photo = await _fileService.SaveFileAsync(reportDto.Photo, "Report");
            }

            var reports = new Report
            {
                Category = reportDto.Category,
                Urgency = reportDto.Urgency,
                Subject = reportDto.Subject,
                Description = reportDto.Description,
                Photo = photo,
                ReportType = reportDto.ReportType,
    UserId = reportDto.UserId
            };

            await _adminRepository.DoReportAsync(reports); 

            return new ApiResponseDto
            {
                IsSuccess = true,
                Message = "Report submitted successfully",
                StatusCode = 200
            };
        }
        catch (Exception ex)
        {
            return new ApiResponseDto
            {
                IsSuccess = false,
                Message = $"An error occurred: {ex.Message}",
                StatusCode = 500
            };
        }
    }

}


