using HealthCareApplication.Dtos.UserDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Contract.IService
{
    public interface IAuthService
    {
        Task<ApiResponseDto> AddUserAsync(UserDto userDto, string role, object UserTypeDetails = null);
        Task<ApiResponseDto> LoginUserAsync(LoginDto loginDto);

        Task <ApiResponseDto> ForgotPasswordAsync(ForgetPasswordDto forgetPasswordDto);  
        Task <ApiResponseDto> ChangePasswordAsync(ChangePasswordDto changePasswordDto);

        Task<ApiResponseDto> ResendOtpAsync(string userId, string Purpose);
    }
}
