using HealthCareApplication.Dtos.UserDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Contract.IService
{
    public interface IChatService
    {
        Task<ApiResponseDto> GetUserListAsync(string Id, string role);
        Task<ApiResponseDto> GetMessagesAsync(string senderId, string receiverId);
    }
}
