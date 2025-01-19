using HealthCareApplication.Contract.IService;
using HealthCareApplication.Dtos.UserDto;
using HealthCareDomain.Entity.Patients;
using HealthCareDomain.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Features.Services
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;

        public ChatService(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }

        public async Task<ApiResponseDto> GetUserListAsync(string Id, string role)
        {
            // Validate input parameters
            if (string.IsNullOrEmpty(Id) || string.IsNullOrEmpty(role))
            {
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "Role or Id not found",
                    StatusCode = 404
                };
            }

            try
            {
                // Check if the role is "Patient"
                if (role.Equals("Patient", StringComparison.OrdinalIgnoreCase))
                {
                    var patients = await _chatRepository.GetPatientListAsync(Id); // Await the async call

                    return new ApiResponseDto
                    {
                        IsSuccess = true,
                        Message = "Patient list fetched successfully",
                        StatusCode = 200,
                        Data = patients
                    };
                }

                // Check if the role is "Doctor"
                if (role.Equals("Doctor", StringComparison.OrdinalIgnoreCase))
                {
                    var doctors = await _chatRepository.GetDoctorListAsync(Id); // Await the async call

                    return new ApiResponseDto
                    {
                        IsSuccess = true,
                        Message = "Doctor list fetched successfully",
                        StatusCode = 200,
                        Data = doctors
                    };
                }

                // Handle the case where the role is not valid
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid role provided",
                    StatusCode = 400
                };
            }
            catch (Exception ex)
            {
                // Handle internal server errors
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = $"Internal server error: {ex.Message}",
                    StatusCode = 500
                };
            }
        }
    }
}
