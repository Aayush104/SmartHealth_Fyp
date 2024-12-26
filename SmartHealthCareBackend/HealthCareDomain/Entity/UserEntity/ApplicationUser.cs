using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Otp;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HealthCareDomain.Entity.UserEntity
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        public string FullName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<OtpHash> Otps { get; set; } = new List<OtpHash>();
        public virtual ICollection<DoctorAdditionalInfo> DoctorAdditionalInfos { get; set; } = new List<DoctorAdditionalInfo>();
    }
}
