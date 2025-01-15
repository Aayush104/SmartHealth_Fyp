using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.Contract.ContractDto
{
    public class GetListById
    {
        //public decimal Amount { get; set; }

        public string? PatientName { get; set; }
        public string? StartTime { get; set; }
        public DateTime? AppointmentDate { get; set; }
        public string? PaymentStatus { get; set; }
     
    }
}
