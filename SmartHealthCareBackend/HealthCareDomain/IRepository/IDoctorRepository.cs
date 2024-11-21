
using HealthCareDomain.Entity.Doctors;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCarePersistence.IRepository
{
    public interface IDoctorRepository
    {
        Task AddDoctor(Doctor doctor);
        Task<IEnumerable<Doctor>> GetAllDoctors();

        Task <Doctor> GetDoctorBYId(string userId);
        Task  UpdateDoctorAsync(Doctor doctor);

        Task<IEnumerable<Doctor>> SearchDoctors(string speciality, string Location);
      
      
    }

}
