using HealthCareApplication.Dtos.AvailabilityDto;
using HealthCareApplication.Dtos.UserDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.IServices
{
   public interface IDoctorAvailabiltyService
    {
        Task<ApiResponseDto> GenerateSlotsAsync(DoctorAvailabilityDto doctorAvailabilityDto);
        Task <List<DoctorAvailabilityDto>> GetAvailabilityAsync(string userId);   
       
    }
}
