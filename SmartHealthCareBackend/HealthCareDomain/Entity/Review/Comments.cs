using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Patients;
using HealthCareDomain.Entity.UserEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareDomain.Entity.Review
{
    public class Comments
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Patient")]
        public string PatientId { get; set; }
        public Patient Patients { get; set; }
        public string UserName { get; set; }

        [ForeignKey("Doctor")]
        public string  DoctorId { get; set; } 
        public Doctor Doctor { get; set; } 

        public string VisitedFor { get; set; }
        public bool IsRecommended { get; set; }

        [MaxLength(1000)]
        public string ReviewText { get; set; }

      
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public virtual ICollection<Reply> Replies { get; set; } = new List<Reply>();
    }
}
