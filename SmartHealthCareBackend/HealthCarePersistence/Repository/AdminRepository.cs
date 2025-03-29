using HealthCareDomain.Entity.Patients;
using HealthCareDomain.IRepository;
using HealthCarePersistence.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthCareApplication.Dtos.AdminDto;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Contract.ContractDto.AdminDto;
using HealthCareDomain.Entity.Announcement;
using HealthCareDomain.Entity.Review;

namespace HealthCarePersistence.Repository
{
    public class AdminRepository : IAdminRepository
    {
        private readonly AppDbContext _dbContext;

        public AdminRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> BlockUserAsync(string Id)
        {
            var user = await _dbContext.Users.FindAsync(Id);
            if (user != null)
            {
                user.IsBlocked = true;
                user.TokenRevokedAt = DateTime.UtcNow;
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> DeleteCommentAsync(int Id)
        {
            var comment = await _dbContext.Comments.FindAsync(Id);

            if(comment != null)
            {
                _dbContext.Comments.Remove(comment);

              
                await _dbContext.SaveChangesAsync();
                return true;


            }
            return false;
        }

        public async Task DoAnnounceAsync(Announce announce)
        {
            await _dbContext.Announces.AddAsync(announce);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<BookingListDto>> GetAllAppointments()
        {
            return await _dbContext.BookAppointments
                 .Include(a => a.Patient)
                 .Include(a => a.Doctor)
                 .Include(a => a.Payments)
                 .Select(a => new BookingListDto
                 {
                     PatientName = a.Patient.User.FullName,
                     DoctorName = a.Doctor.User.FullName,
                     AppointmentDate = a.AppointmentDate,
                     AppointmentTime = a.Slot,
                     PaymentStatus = a.PaymentStatus,
                     PaymentAmount = a.Payments.FirstOrDefault().Amount,
                     DoctorSpecialization = a.Doctor.Specialization

                 })
                 .ToListAsync();

        }

        public async Task<IEnumerable<Doctor>> GetAllDoctors()
        {
            var doctorsExist = await _dbContext.Doctors.AnyAsync();

            if (!doctorsExist)
            {
                return Enumerable.Empty<Doctor>();
            }


            var doctors = await _dbContext.Doctors.Where(x => x.Status == "Accepted").Include(d => d.User).ToListAsync();
            return doctors;
        }

        public async Task<List<Announce>> GetAllNotificationAsync()
        {
            var notification = await _dbContext.Announces.ToListAsync();
            return notification;
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
                    Gender = p.Gender,
                    IsBlocked = p.User.IsBlocked

                })
                .ToListAsync();
        }

        public async Task<bool> UnBlockUserAsync(string Id)
        {
            var user = await _dbContext.Users.FindAsync(Id);
            if (user != null)
            {
                user.IsBlocked = false;
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> UpdateNotificationStatus()
        {
            var announces = await _dbContext.Announces.ToListAsync();

            if (announces.Any())
            {
                foreach (var announce in announces)
                {
                    announce.IsMarked = true;
                }

                await _dbContext.SaveChangesAsync();
                return true;
            }

            return false;
        }
    }
}