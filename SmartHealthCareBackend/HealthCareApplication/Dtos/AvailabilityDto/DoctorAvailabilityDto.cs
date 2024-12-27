using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.AvailabilityDto
{
   public class DoctorAvailabilityDto
    {
        public string DoctorId { get; set; }
      
        public List<TimeSlot> TimeSlots { get; set; }
    }
}
