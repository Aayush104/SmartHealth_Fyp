using HealthCareDomain.Entity.Otp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.IRepository
{
    public interface IOtpRepository
    {
        Task AddOtp(OtpHash otpHash);
        Task<OtpHash> GetLatestOtp(string UserId, string Purpose);

        Task UpdateOtp(OtpHash otpHash);
    }
}
