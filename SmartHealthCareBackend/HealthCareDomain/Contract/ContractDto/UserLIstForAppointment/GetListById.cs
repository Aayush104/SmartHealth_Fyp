using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.Contract.ContractDto.NewFolder
{
    public class GetListById
    {


        public int AppointmentId { get; set; }
     
        public string PatientFullName { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Slot { get; set; }

        public string MeetingId { get; set;}
        public string EndTime { get; set; }
        public string Status { get; set; }
        public string PaymentStatus { get; set; }

        public bool IsButtonEnabled { get; set; }

    }
}
