using HealthCareDomain.Contract.ContractDto.NewFolder;
using HealthCareDomain.Contract.ContractDto.UserLIstForAppointment;
using HealthCareDomain.Entity.Appointment;
using HealthCareDomain.Entity.Doctors;
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
       Task <List<GetListById>> GetListByIdAsync(string Id);
       Task <List<GetDoctorByIdDto>> GetDoctorListByIdAsync(string Id);
    }
}
