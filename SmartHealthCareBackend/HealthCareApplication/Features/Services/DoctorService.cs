using HealthCareApplication.Contract.IService;
using HealthCareApplication.Dtos.UserDto;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.UserEntity;
using HealthCareInfrastructure.DataSecurity;
using HealthCarePersistence.IRepository;
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
        public DoctorService(UserManager<ApplicationUser> userManager, IDoctorRepository doctorRepository, IDataProtectionProvider dataProtector, DataSecurityProvider securityProvider)
        {
            _userManager = userManager;
            _doctorRepository = doctorRepository;
            _dataProtector = dataProtector.CreateProtector(securityProvider.securityKey);
        }

        public async Task<ApiResponseDto> AddProfileDetails(AddProfileDto addProfileDto)
        {
            var userId = addProfileDto.userId;

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

          

            existingDoctor.Experience = !string.IsNullOrEmpty(addProfileDto.Experience)
                                        ? addProfileDto.Experience
                                        : null;
            

            existingDoctor.AvailabilityDays = !string.IsNullOrEmpty(addProfileDto.AvailabilityDays)
                                        ? addProfileDto.AvailabilityDays
                                        : null;
            
            existingDoctor.AvailabilityTime = !string.IsNullOrEmpty(addProfileDto.AvailabilityTime)
                                        ? addProfileDto.AvailabilityTime
                                        : null; 

            existingDoctor.Description = !string.IsNullOrEmpty(addProfileDto.Description)
                                        ? addProfileDto.Description
                                        : null;
            
            existingDoctor.Fee = !string.IsNullOrEmpty(addProfileDto.Fee)
                                        ? addProfileDto.Fee
                                        : null;

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
                   AvailabilityDays = doctorDetails.AvailabilityDays,  
                    AvailabilityTime = doctorDetails.AvailabilityTime,   
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
 