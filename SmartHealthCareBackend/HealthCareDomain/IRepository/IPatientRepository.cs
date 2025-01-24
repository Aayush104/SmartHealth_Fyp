
using HealthCareDomain.Entity.Patients;
using HealthCareDomain.Entity.UserEntity;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCarePersistence.IRepository
{
    public interface IPatientRepository
    {

     
        Task AddPatient(Patient patient);
        Task <Patient> GetPatientDetailAsync(string userId);

        Task<Patient> UpdatePatientDetailsAsync(Patient patient, string userId);


    }
}
