
using HealthCareDomain.Entity.Doctors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.IRepository
{
   public interface IDoctorAvailabilityRepository
    {

        Task SaveSlotsAsync(List<DoctorAvailability> slot);
        Task <List<DoctorAvailability>> GetSlotsAsync(string userId);

        Task<DoctorAvailability> GetAvailabilityBySlotAsync(string doctorId, DateTime date, string timeSlot);
        Task UpdateAvailabilityAsync(DoctorAvailability availability);
      


    }
}
