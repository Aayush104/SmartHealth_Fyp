﻿
using HealthCarePersistence.DatabaseContext;
using HealthCareDomain.IRepository;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthCareDomain.Entity.Doctors;

namespace HealthCarePersistence.Repository
{
    public class DoctorAvailabilityRepository : IDoctorAvailabilityRepository

    {
        private readonly AppDbContext _dbContext;

        public DoctorAvailabilityRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DoctorAvailability> GetAvailabilityBySlotAsync(string doctorId, DateTime date, string timeSlot)
        {
            return await _dbContext.DoctorAvailabilities.Where(x => x.DoctorId == doctorId && x.Date == date && x.StartTime == timeSlot).FirstOrDefaultAsync();
        }

       

        public async Task<List<DoctorAvailability>> GetSlotsAsync(string userId)
        {

            var currentDateTime = DateTime.Now;

            var slots = await _dbContext.DoctorAvailabilities
                .Where(x => x.DoctorId == userId && !x.IsBooked) // Exclude booked slots
                .Where(x => x.Date > currentDateTime.Date ||
                            (x.Date == currentDateTime.Date &&
                             TimeSpan.Parse(x.EndTime) > currentDateTime.TimeOfDay)) // Exclude past date or past time slots
                .ToListAsync();

            return slots;
        }

 

        public async Task SaveSlotsAsync(List<DoctorAvailability> slots)
        {
            await _dbContext.DoctorAvailabilities.AddRangeAsync(slots);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAvailabilityAsync(DoctorAvailability availability)
        {
            _dbContext.DoctorAvailabilities.Update(availability);
            await _dbContext.SaveChangesAsync();
        }
    }
}
