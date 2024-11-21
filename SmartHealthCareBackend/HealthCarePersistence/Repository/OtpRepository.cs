using HealthCareDomain.Entity.Otp;
using HealthCareDomain.IRepository;
using HealthCarePersistence.DatabaseContext;
using Microsoft.EntityFrameworkCore; 
using System.Linq;
using System.Threading.Tasks;

namespace HealthCarePersistence.Repository
{
    public class OtpRepository : IOtpRepository
    {
        private readonly AppDbContext _context;

        public OtpRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddOtp(OtpHash otpHash)
        {
            await _context.Otps.AddAsync(otpHash);
            await _context.SaveChangesAsync();
        }

        public async Task<OtpHash> GetLatestOtp(string userId, string purpose)
        {
            return await _context.Otps
                .Where(x => x.UserId == userId && x.Purpose == purpose && !x.IsUsed)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync(); 
        }

        public async Task UpdateOtp(OtpHash otpHash)
        {
            _context.Otps.Update(otpHash); 
            await _context.SaveChangesAsync();
        }
    }
}
