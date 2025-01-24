using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Patients;
using HealthCareDomain.Entity.UserEntity;
using HealthCarePersistence.DatabaseContext;
using HealthCarePersistence.IRepository;
using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCarePersistence.Repository
{
    public class PatientRepository : IPatientRepository
    {
        private readonly AppDbContext _context;

        public PatientRepository(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }


        public async Task AddPatient(Patient patient)
        {
            await _context.Patients.AddAsync(patient);
            await _context.SaveChangesAsync();



        }

        public async Task<Patient> GetPatientDetailAsync(string userId)
        {




            return await _context.Patients.Where(t => t.Id == userId)
                .Include(d => d.User)
         .FirstOrDefaultAsync(x => x.Id == userId);

        }



        public async Task<Patient> UpdatePatientDetailsAsync(Patient patient, string userId)
        {
            try
            {


                var existingPatient = await _context.Patients
                .FirstOrDefaultAsync(p => p.Id == userId);

                if (existingPatient != null)
                {
                    // Update existing patient details
                    existingPatient.Gender = patient.Gender;
                    existingPatient.Address = patient.Address;

                    // You may add any additional fields here to be updated

                    _context.Patients.Update(existingPatient);  // Mark the patient as updated
                    await _context.SaveChangesAsync();  // Save the changes to the database

                    return existingPatient;  // Return the updated patient
                }

                return null;


            }
            catch (Exception ex)
            {
                // Handle any errors that might occur
                // You may log the error here if needed
                return null;
            }
        }
    }
}
