using HealthCareApplication.Dtos.AvailabilityDto;
using HealthCareApplication.Dtos.CommentDto;
using HealthCareApplication.Dtos.UserDto;
using HealthCareDomain.Entity.Appointment;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Contract.IService
{
    public interface IAppointmentService
    {
        Task<ApiResponseDto> BookAppointmentAsync(AppointmentDto appointmentDto, string userId, decimal total_Amount, string PaymentMethod);
        Task<ApiResponseDto> GetAppointmentListAsync(string userId, string role);

        Task<ApiResponseDto> ChecKMeetingIdAsync(string MeetingId);
        Task<ApiResponseDto> CheckforCommentAsync(string DoctorId , string UserId);
        Task <ApiResponseDto>UploadVideoAsync(IFormFile videoFile, string meetingId);
    }
}
