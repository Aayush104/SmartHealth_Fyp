using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.Contract.ContractDto.UserLIstForAppointment
{
    public  class GetDoctorListByIdDto
    {

        public string DoctorId { get; set; }

        public string DoctorName { get; set; }
        public string? DoctorProfile { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Slot { get; set; }
        public string EndTime { get; set; }

        public string speciality { get; set; }

        public string? VideoUrl { get; set; }
        

    }
}
