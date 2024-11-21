using HealthCareDomain.Entity.UserEntity;
using Microsoft.AspNet.Identity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareDomain.Entity.Otp
{
    public class OtpHash
    {
        [Key]
        public int Id { get; set; }
        public string HashedOtp { get; set; }

       

        public bool IsUsed { get; set; } 

        [StringLength(50)] 
        public string Purpose { get; set; }

        [Required]
        public string UserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

     

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
    }
}
