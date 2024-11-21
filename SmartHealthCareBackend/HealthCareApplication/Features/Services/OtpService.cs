using HealthCareDomain.Entity.Otp;
using HealthCareDomain.Entity.UserEntity;
using HealthCareDomain.IRepository;
using HealthCareDomain.IServices;
using HealthCareInfrastructure.DataSecurity;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Features.Services
{
    public class OtpService : IOtpService
    {

        private readonly IOtpRepository _otpRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IDataProtector _dataProtector;
        public OtpService(IOtpRepository otpRepository, UserManager<ApplicationUser> userManager, IDataProtectionProvider dataProtector, DataSecurityProvider securityProvider
           )
        {
            _otpRepository = otpRepository;
            _userManager = userManager;
            _dataProtector = dataProtector.CreateProtector(securityProvider.securityKey);   
        }
     

        public Task StoreOtpAsync(string userId, string purpose, string otp)
        {
            if (userId == null)
            {
                throw new ArgumentNullException(nameof(userId));
            }

            if (purpose == null)
            {
                throw new ArgumentNullException(nameof(purpose));
            }

            if (otp == null)
            {
                throw new ArgumentNullException(nameof(otp));
            }

            OtpHash hash = new()
            {

                UserId = userId,
                Purpose = purpose,
                HashedOtp = otp,
                IsUsed = false,
                CreatedAt = DateTime.Now.AddMinutes(5)

            };

            _otpRepository.AddOtp(hash);
            return Task.CompletedTask;  
        }

        public async Task<bool> VerifyDoctorOtpAsync(string userId, string otp, string purpose)
        {
            
            var latestOtp = await _otpRepository.GetLatestOtp(userId, purpose);

         
            if (latestOtp == null || latestOtp.IsUsed)
            {
                return false;
            }

         
            if (latestOtp.HashedOtp == otp)
            {
                
                latestOtp.IsUsed = true;
                await _otpRepository.UpdateOtp(latestOtp);

              
                var user = await _userManager.FindByIdAsync(userId);

              
                if (user != null)
                {
                 
                    if (string.Equals(purpose, "Registration", StringComparison.OrdinalIgnoreCase))
                    {
                        user.EmailConfirmed = true;
                        var result = await _userManager.UpdateAsync(user);

                      
                        return result.Succeeded;
                    }

                  
                    return true;
                }
            }

         
            return false;
        }

    

        public async Task<bool> verifyOtpAsync(string UserId, string Otp, string Purpose)
        {
            var unhashedUserId = _dataProtector.Unprotect(UserId);  

            var latestOtp = await _otpRepository.GetLatestOtp(unhashedUserId, Purpose);

           
             if (latestOtp == null || latestOtp.IsUsed || DateTime.UtcNow >= latestOtp.CreatedAt)
            {
                return false;
            }

            if (latestOtp.HashedOtp == Otp) 
            {
                latestOtp.IsUsed = true;

                await _otpRepository.UpdateOtp(latestOtp);



                var user = await _userManager.FindByIdAsync(unhashedUserId); 

                if (user != null)
                {
                    if (Purpose == "Registration")
                    {
                        user.EmailConfirmed = true; 
                        var result = await _userManager.UpdateAsync(user); 

                        return result.Succeeded;
                    }
                }


                return true;
            }

            return false;

        }
    }
}
