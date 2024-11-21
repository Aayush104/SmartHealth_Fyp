using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.AvailabilityDto
{
    public class AppointmentDto
    {
        public string DoctorId { get; set; }

        public string PatientId { get; set; }

        public DateTime Date { get; set; }

        public string TimeSlot { get; set; }

    }
}
