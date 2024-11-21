using HealthCareDomain.Entity.Otp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.IServices
{
    public interface IOtpService
    {
        Task StoreOtpAsync(string userId , string purpose, string otp);
        Task <bool> verifyOtpAsync(string UserId ,string Otp, string Purpose);
        Task <bool> VerifyDoctorOtpAsync(string userId ,string otp, string purpose);
    }
}
