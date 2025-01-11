using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.AvailabilityDto
{
    public class AppointmentDto
    {
        public string QueryType { get; set; }
        public string DoctorId { get; set; }
        public string Amount { get; set; }
        public string StartTime { get; set; }
           public DateTime AppointmentDate { get; set; }


    }
}
