﻿using HealthCareApplication.Contracts.Email;
using HealthCareApplication.Dtos.UserDto;
using HealthCareApplication.Helper;
using HealthCareApplication.StatusHub;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.UserEntity;
using HealthCareDomain.IRepository;
using HealthCareDomain.IServices;
using HealthCareInfrastructure.DataSecurity;
using HealthCarePersistence.IRepository;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
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
    private readonly IMailService _mailService;
    private readonly IOtpService _otpService;
    private readonly IDataProtector _dataProtector;


    public AdminService(IDoctorRepository doctorRepository, UserManager<ApplicationUser> userManager, IMailService mailService,IOtpService otpService, 
     IDataProtectionProvider dataProtection, DataSecurityProvider securityProvider, IAdminRepository adminRepository, IHubContext<UserHub> hubContext)
        {
            _doctorRepository = doctorRepository;
            _userManager = userManager;
        _mailService = mailService; 
        _otpService = otpService;
        _adminRepository = adminRepository;
        _hubContext = hubContext;
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

}

