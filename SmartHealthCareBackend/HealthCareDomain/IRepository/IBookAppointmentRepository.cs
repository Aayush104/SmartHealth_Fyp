using HealthCareDomain.Entity.Appointment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.IRepository
{
   public interface IBookAppointmentRepository
    {
        Task <int> BookAppointment(BookAppointment bookappoinment);
        Task<bool> Paymentasync(Payment payment);
    }
}
