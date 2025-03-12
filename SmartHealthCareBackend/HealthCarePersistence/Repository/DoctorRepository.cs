
using HealthCarePersistence.DatabaseContext;
using HealthCarePersistence.IRepository;
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore; 

using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HealthCareDomain.Entity.Doctors;
using static System.Reflection.Metadata.BlobBuilder;
using HealthCareDomain.Entity.Review;
using HealthCareDomain.Contract.ContractDto.DoctorRevenue;
using System.Numerics;




namespace HealthCarePersistence.Repository
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly AppDbContext _dbContext;
        public DoctorRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddAdditionalInfoAsync(DoctorAdditionalInfo info)
        {
            await _dbContext.DoctorAdditionalInfos.AddAsync(info);
            await _dbContext.SaveChangesAsync();


        }

        public async Task AddComment(Comments comments)
        {
            await _dbContext.Comments.AddAsync(comments);
            await _dbContext.SaveChangesAsync();    
        }

        public async Task AddDoctor(Doctor doctor)
        {
           await _dbContext.Doctors.AddAsync(doctor); 
            await _dbContext.SaveChangesAsync();    

        }

        public async Task AddReply(Reply reply)
        {
            await _dbContext.Replies.AddAsync(reply);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<DoctorRevenue>> DoctorRevenuesById(string id)
        {
            var revenueData = await _dbContext.Payments
                .Where(p => p.Appointment.DoctorId == id)
                   .GroupBy(p => new { p.PaymentDate.Year, p.PaymentDate.Month })
            .Select(g => new DoctorRevenue
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                Revenue = g.Sum(p => p.Amount)
            })
            .OrderBy(g => g.Year).ThenBy(g => g.Month)
            .ToListAsync();

            return revenueData;
        }

        public async Task<IEnumerable<Doctor>> GetAllDoctors()
        {
         
            var doctorsExist = await _dbContext.Doctors.AnyAsync();

            if (!doctorsExist)
            {
                return Enumerable.Empty<Doctor>();
            }

           
            var doctors = await _dbContext.Doctors.Where(x => x.Status == "Pending").Include(d => d.User).ToListAsync();
            return doctors;
        }

        public async Task<List<DoctorAdditionalInfo>> GetByUserIdFromAdditionalAsync(string userId)
        {
            return await _dbContext.DoctorAdditionalInfos
            .Where(d => d.UserId == userId)
            .ToListAsync();
        }

        public async Task<List<Comments>> GetCommentsAsync(string userId)
        {
            return await _dbContext.Comments
           .Where(d => d.DoctorId == userId)
           .ToListAsync();
        }

        public async  Task<Doctor>GetDoctorBYId(string userId)
        {
            return await _dbContext.Doctors.Include(d => d.User)
         .FirstOrDefaultAsync(x => x.Id == userId);
        }


        public async Task<IEnumerable<Doctor>> SearchDoctors(string speciality, string location)
        {
            var doctors = await _dbContext.Doctors
                .Where(d => d.Specialization == speciality && d.Location == location)
                .Include(d => d.User)
               
                .Where(d => d.User.EmailConfirmed == true)
                .ToListAsync();
            return doctors;
        }

        public async Task UpdateAdditionalAsync(DoctorAdditionalInfo info)
        {
             _dbContext.DoctorAdditionalInfos.Update(info);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateDoctorAsync(Doctor doctor)
        {
            _dbContext.Doctors.Update(doctor);
            await _dbContext.SaveChangesAsync();
        }

     
     public async   Task<List<Reply> >GetReplyAsync(int CommentId)
        {
            return await _dbContext.Replies
            .Where(d => d.CommentId == CommentId)
            .ToListAsync();
        }

        public async Task<List<Comments>> DoctorNotificationById(string id)
        {
            return await _dbContext.Comments.Where(d => d.DoctorId == id).ToListAsync();
        }
    }
}
