using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.UserDto
{
    public class OtpVerificationDto
    {
        public string UserId { get; set; } 

        public string  Otp { get; set; }

       public string Purpose { get; set; } 
    }
}
