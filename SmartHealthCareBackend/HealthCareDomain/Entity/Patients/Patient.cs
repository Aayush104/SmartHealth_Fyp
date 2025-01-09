using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HealthCareDomain.Entity.Appointment;
using HealthCareDomain.Entity.UserEntity;

namespace HealthCareDomain.Entity.Patients
{
    public class Patient
    {
        [Key]
        [ForeignKey("User")]
        public string Id { get; set; }

        public ApplicationUser User { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public string? Address{ get; set; }
        public string? Gender{ get; set; }
      
        public virtual ICollection<BookAppointment> BookAppointments { get; set; } = new List<BookAppointment>();

    }
}
