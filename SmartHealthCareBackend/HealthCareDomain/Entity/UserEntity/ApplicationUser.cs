
using HealthCareDomain.Entity.Otp;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.Entity.UserEntity
{
    public class ApplicationUser : IdentityUser
    {

        public string FullName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<OtpHash> Otps { get; set; } = new List<OtpHash>();



    }
}
