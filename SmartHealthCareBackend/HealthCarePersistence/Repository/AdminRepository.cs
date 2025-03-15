using HealthCareDomain.Entity.Patients;
using HealthCareDomain.IRepository;
using HealthCarePersistence.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthCareApplication.Dtos.AdminDto;

namespace HealthCarePersistence.Repository
{
    public class AdminRepository : IAdminRepository
    {
        private readonly AppDbContext _dbContext;

        public AdminRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

   
        public async Task<IEnumerable<PatientListDto>> GetPatient()
        {
            return await _dbContext.Patients
                .Include(p => p.User)
                .Where(p => p.User.EmailConfirmed == true)
                .Select(p => new PatientListDto
                {
                    Id = p.Id,
                    FullName = p.User.FullName,
                    Email = p.User.Email,
                    PhoneNumber = p.User.PhoneNumber,
                    Address = p.Address,
                    Gender = p.Gender
                })
                .ToListAsync();
        }
    }
}
