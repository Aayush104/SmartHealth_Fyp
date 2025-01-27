using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.Contract.ContractDto.UserLIstForAppointment
{
    public  class GetDoctorByIdDto
    {

        public int AppointmentId { get; set; }
        public string DoctorName { get; set; }
        public string DoctorProfile { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Slot { get; set; }
    }
}
