using HealthCareApplication.Dtos.UserDto;
using HealthCareApplication.Dtos.UserDtoo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Contract.IService
{
    public interface IPatientService
    {
        Task<ApiResponseDto> GetPatientDetailsAsync(string userId);
        Task<ApiResponseDto> AddPatientDetailsAsync(AddPatientDetailsDto addPatientDetailsDto, string userId);
    }
}
