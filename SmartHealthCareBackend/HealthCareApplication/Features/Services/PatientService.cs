using HealthCareApplication.Contract.IService;
using HealthCareApplication.Dtos.UserDto;
using HealthCareApplication.Dtos.UserDtoo;
using HealthCareDomain.Entity.Patients;
using HealthCareDomain.Entity.UserEntity;
using HealthCarePersistence.IRepository;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;

namespace HealthCareApplication.Features.Services
{
    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _patientRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public PatientService(IPatientRepository patientRepository, UserManager<ApplicationUser> userManager)
        {
            _patientRepository = patientRepository;
            _userManager = userManager;
        }

        public async Task<ApiResponseDto> AddPatientDetailsAsync(AddPatientDetailsDto addPatientDetailsDto, string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);  

            if (user != null)
            {
                user.PhoneNumber = addPatientDetailsDto.phoneNumber; 

                var result = await _userManager.UpdateAsync(user); 

                if (result.Succeeded)
                {
                    var patient = new Patient
                    {

                        Gender = addPatientDetailsDto.Gender,
                        Address = addPatientDetailsDto.Address
                    };

                    var updatedPatient = await _patientRepository.UpdatePatientDetailsAsync(patient, userId);  

                    if (updatedPatient != null)
                    {
                        return new ApiResponseDto { IsSuccess = true, Message = "Patient details updated successfully" , StatusCode = 200 };
                    }
                    else
                    {
                        return new ApiResponseDto { IsSuccess = false, Message = "Failed to update patient details in the repository", StatusCode = 500 };
                    }
                }
                else
                {
                    return new ApiResponseDto { IsSuccess = false, Message = "Failed to update user details", StatusCode = 500 };
                }
            }

            return new ApiResponseDto { IsSuccess = false, Message = "User not found", StatusCode = 400 };
        }


        public async Task<ApiResponseDto> GetPatientDetailsAsync(string userId)
        {
            try
            {
                // Check if the userId is null or empty
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = "User ID is required.",
                        StatusCode = 400
                    };
                }

                // Retrieve patient details using the repository
                var patients = await _patientRepository.GetPatientDetailAsync(userId);

                // Check if no patient is found
                if (patients == null)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = "No patient found with the provided User ID.",
                        StatusCode = 404
                    };
                }

                // Return successful response with patient data
                return new ApiResponseDto
                {
                    IsSuccess = true,
                    Message = "Patient details retrieved successfully.",
                    StatusCode = 200,
                    Data = patients
                };
            }
            catch (Exception ex)
            {
                // Log the exception (consider adding a logging service)
                Console.WriteLine($"Error occurred while fetching patient details: {ex.Message}");

                // Return error response
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "An error occurred while fetching patient details.",
                    StatusCode = 500,
                    Data = ex.Message // Optional: Return exception details for debugging
                };
            }
        }

      
    }
}
 