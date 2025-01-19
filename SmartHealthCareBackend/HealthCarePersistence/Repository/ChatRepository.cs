using HealthCareDomain.Entity.UserEntity;
using HealthCareDomain.IRepository;
using HealthCarePersistence.DatabaseContext;
using HealthCareApplication.Dtos.ChatDto; // Ensure this is included
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace HealthCarePersistence.Repository
{
    public class ChatRepository : IChatRepository
    {
        private readonly AppDbContext _dbContext;

        public ChatRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

    
        public async Task<List<UserListDto>> GetDoctorListAsync(string userId)
        {
            var response = await _dbContext.BookAppointments
                .Where(t => t.DoctorId == userId)
                .Include(x => x.Patient)
                .ThenInclude(patient => patient.User)
                .Select(x => new UserListDto
                {
                    Id = x.Patient.User.Id,
                    Name = x.Patient.User.FullName
                })
                .GroupBy(x => x.Id) 
                .Select(group => group.First()) 
                .ToListAsync();

            return response;
        }

        
        public async Task<List<UserListDto>> GetPatientListAsync(string userId)
        {
            var response = await _dbContext.BookAppointments
                .Where(t => t.PatientId == userId)
                .Include(x => x.Doctor)
                .ThenInclude(doctor => doctor.User)
                .Select(x => new UserListDto
                {
                    Id = x.Doctor.User.Id,
                    Name = x.Doctor.User.FullName
                })
                .GroupBy(x => x.Id) 
                .Select(group => group.First()) 
                .ToListAsync();

            return response;
        }
    }
}
