using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Otp;
using HealthCareDomain.Entity.Reporting;

using HealthCareDomain.Entity.Review;
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

        public bool IsBlocked { get; set; }
        public DateTime? TokenRevokedAt { get; set; }
        // Navigation properties
        public virtual ICollection<OtpHash> Otps { get; set; } = new List<OtpHash>();
        public virtual ICollection<DoctorAdditionalInfo> DoctorAdditionalInfos { get; set; } = new List<DoctorAdditionalInfo>();
        public virtual ICollection<Report> Reports { get; set; } = new List<Report>();
       
    }
}
