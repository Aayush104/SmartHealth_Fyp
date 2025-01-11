using HealthCareApplication.Dtos.AvailabilityDto;

using HealthCareApplication.Dtos.UserDto;
using HealthCareDomain.Entity.Appointment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Contract.IService
{
    public interface IAppointmentService
    {
        Task<ApiResponseDto> BookAppointmentAsync(AppointmentDto appointmentDto, string userId);
    }
}
