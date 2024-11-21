using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HealthCareDomain.Entity.Appointment;
using HealthCareDomain.Entity.UserEntity;
using Microsoft.Identity.Client;

namespace HealthCareDomain.Entity.Doctors
{
    public class Doctor
    {
        [Key]
        [ForeignKey("User")]
        public string Id { get; set; }

        public ApplicationUser User { get; set; }

        [Required]
        public string Specialization { get; set; }

        [Required]
        public string LicenseNumber { get; set; }

        [Required]
        public string Qualifications { get; set; }

        public string Status { get; set; } = "Pending";

        public string LicenseFilePath { get; set; }
        public string QualificationsFilePath { get; set; }
        public string GovernmentIdFilePath { get; set; }

    
        public string? Location { get; set; }
        public string? Experience { get; set; }    
        public string? Availability { get; set; } 

        public virtual ICollection<DoctorAvailability> AvailabilityList { get; set; }
        public virtual ICollection<BookAppointment> BookAppointments { get; set; } = new List<BookAppointment>();


    }
}
