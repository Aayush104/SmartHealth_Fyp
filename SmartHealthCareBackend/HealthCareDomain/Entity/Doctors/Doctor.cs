using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HealthCareDomain.Entity.Appointment;
using HealthCareDomain.Entity.UserEntity;

namespace HealthCareDomain.Entity.Doctors
{
    public class Doctor
    {
        [Key]
        [ForeignKey("User")]
        public string Id { get; set; } // Primary key

        public virtual ApplicationUser User { get; set; }

        [Required]
        public string Specialization { get; set; }

        [Required]
        public string Location { get; set; }

        [Required]
        public string LicenseNumber { get; set; }

        [Required]
        public string Qualifications { get; set; }

        public string Status { get; set; } = "Pending";

        public string LicenseFilePath { get; set; }
        public string QualificationsFilePath { get; set; }
        public string GovernmentIdFilePath { get; set; }

        public string? Profile { get; set; }
        public string? Experience { get; set; }
        public string? FromDay { get; set; }
        public string? ToDay { get; set; }
        public string? FromTime { get; set; }
        public string? ToTime { get; set; }
        public string? Description { get; set; }
        public string? Fee { get; set; }

        public virtual ICollection<DoctorAvailability> AvailabilityList { get; set; } = new List<DoctorAvailability>();
        public virtual ICollection<BookAppointment> BookAppointments { get; set; } = new List<BookAppointment>();

     
    }
}
