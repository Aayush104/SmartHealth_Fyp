using HealthCareApplication.Dtos.AdminDto;
using HealthCareApplication.Dtos.AnnouncementDto;
using HealthCareApplication.Dtos.UserDto;
using HealthCareDomain.Entity.Doctors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.IServices
{
    public interface IAdminService
    {

        Task<IEnumerable<DoctorDetailsDto>> GetAllDoctorsAsync();
        Task<ApiResponseDto> AcceptDoctorAsync(string email);
        Task<ApiResponseDto> RejectDoctorAsync(string email);
        Task<ApiResponseDto> ConfirmDoctorEmailAsync(string email, string otp);
        Task<ApiResponseDto> GetAllPatientAsync();
        Task<ApiResponseDto> BlockUserAsync(string Id);
        Task<ApiResponseDto> UnBlockUserAsync(string Id);
        Task<ApiResponseDto> UnBlockDoctorAsync(string Id);
        Task<ApiResponseDto> DeleteCommentAsync(int Id);
        Task<ApiResponseDto> BlockDoctorAsync(string Id);
        Task<IEnumerable<DoctorDetailsDto>> GetAllVerifiedDoctorAsync();
        Task<ApiResponseDto> GetAllBookingAsync();
        Task<ApiResponseDto> DoAnnouncementAsync(AnnounceDto announceDto);

        Task<ApiResponseDto> GetAnnouncementNotificationAsync();
        Task<ApiResponseDto> MarkNotificationAsReadAsync();


    }
}
