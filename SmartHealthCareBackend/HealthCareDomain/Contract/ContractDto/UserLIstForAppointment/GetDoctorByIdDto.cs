using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.Contract.ContractDto.UserLIstForAppointment
{
    public  class GetDoctorByIdDto
    {

        public int AppointmentId { get; set; }
public string DoctorId { get; set; }

        public string MeetingId { get; set; }
        public string DoctorName { get; set; }
        public string DoctorProfile { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Slot { get; set; }
        public string EndTime { get; set; }

        public bool IsButtonEnabled { get; set; }
    }
}
