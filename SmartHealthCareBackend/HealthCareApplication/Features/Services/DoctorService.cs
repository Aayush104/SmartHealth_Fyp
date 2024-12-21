using HealthCareApplication.Contract.IService;
using HealthCareApplication.Contracts.IService;
using HealthCareApplication.Dtos.UserDto;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.UserEntity;
using HealthCareInfrastructure.DataSecurity;
using HealthCarePersistence.IRepository;
using HealthCarePersistence.Migrations;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HealthCareApplication.Features.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IDataProtector _dataProtector;
        private readonly IFileService _fileService;
        public DoctorService(UserManager<ApplicationUser> userManager, IDoctorRepository doctorRepository, IDataProtectionProvider dataProtector, DataSecurityProvider securityProvider, IFileService fileService)
        {
            _userManager = userManager;
            _doctorRepository = doctorRepository;
            _fileService = fileService;
            _dataProtector = dataProtector.CreateProtector(securityProvider.securityKey);
        }

        public async Task<ApiResponseDto> AddProfileDetails(AddProfileDto addProfileDto)
        {
            var userId = addProfileDto.userId;

            // Check if the doctor exists
            var existingDoctor = await _doctorRepository.GetDoctorBYId(userId);
            if (existingDoctor == null)
            {
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "Doctor profile not found",
                    StatusCode = 404
                };
            }

            // Update doctor profile details if values are provided
            existingDoctor.Experience = !string.IsNullOrWhiteSpace(addProfileDto.Experience)
                                        ? addProfileDto.Experience
                                        : existingDoctor.Experience;

            existingDoctor.FromDay = !string.IsNullOrWhiteSpace(addProfileDto.FromDay)
                                     ? addProfileDto.FromDay
                                     : existingDoctor.FromDay;

            existingDoctor.ToDay = !string.IsNullOrWhiteSpace(addProfileDto.ToDay)
                                   ? addProfileDto.ToDay
                                   : existingDoctor.ToDay;

            existingDoctor.FromTime = !string.IsNullOrWhiteSpace(addProfileDto.FromTime)
                                      ? addProfileDto.FromTime
                                      : existingDoctor.FromTime;

            existingDoctor.ToTime = !string.IsNullOrWhiteSpace(addProfileDto.ToTime)
                                    ? addProfileDto.ToTime
                                    : existingDoctor.ToTime;

            existingDoctor.Description = !string.IsNullOrWhiteSpace(addProfileDto.Description)
                                         ? addProfileDto.Description
                                         : existingDoctor.Description;

            existingDoctor.Fee = !string.IsNullOrWhiteSpace(addProfileDto.Fee)
                                 ? addProfileDto.Fee
                                 : existingDoctor.Fee;

            // Handle profile picture upload
            if (addProfileDto.Profile != null)
            {
                try
                {
                    existingDoctor.Profile= await _fileService.SaveFileAsync(addProfileDto.Profile, "Profile");
                    
                }
                catch (Exception ex)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = $"Failed to upload profile picture: {ex.Message}",
                        StatusCode = 500
                    };
                }
            }

            // Update the doctor details in the repository
            await _doctorRepository.UpdateDoctorAsync(existingDoctor);

            return new ApiResponseDto
            {
                IsSuccess = true,
                Message = "Doctor profile updated successfully",
                StatusCode = 200
            };
        }


        public async Task<DoctorDetailsDto> GetDoctorDetails(string Id)
        {
            try
            {
                
                var doctorId = _dataProtector.Unprotect(Id);

              
                var doctorDetails = await _doctorRepository.GetDoctorBYId(doctorId);

               
                if (doctorDetails == null)
                {
                    throw new Exception("Doctor not found.");
                }

           
                var doctor = new DoctorDetailsDto
                {
                    
                   FullName = doctorDetails.User.FullName,
                   Email = doctorDetails.User.Email,
                    Specialization = doctorDetails.Specialization,
                    Qualifications = doctorDetails.Qualifications,
                   FromDay = doctorDetails.FromDay, 
                   Profileget = doctorDetails.Profile,
                   ToDay = doctorDetails.ToDay,  
                    FromTime = doctorDetails.FromTime,  
                   ToTime = doctorDetails.ToTime,  
                   Loction = doctorDetails.Location,
                   Description = doctorDetails.Description,
                   Fee = doctorDetails.Fee, 
                    Experience = doctorDetails.Experience
                    

                };

               
                return doctor;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching doctor details.", ex);
            }
        }


        public async Task<IEnumerable<DoctorDetailsDto>> SearchDoctorAsync(SearchDto searchDto)
        {
            try
            {
                var filteredDoctors = await _doctorRepository.SearchDoctors(searchDto.Speciality, searchDto.Location);

             

                var doctorList = filteredDoctors.Select(doctor => new DoctorDetailsDto
                {
                    
                    userId = _dataProtector.Protect(doctor.Id),
                    FullName = doctor.User.FullName,
                    Profileget = doctor.Profile,
                 
                    Specialization = doctor.Specialization,
                   
                    Qualifications = doctor.Qualifications,
                  
                  
                  
                    //Location = doctor.Location,
                   
                    Experience = doctor.Experience,
                }).ToList();

             

                return doctorList;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching doctors.", ex);
            }
        }


        
    }
}
 