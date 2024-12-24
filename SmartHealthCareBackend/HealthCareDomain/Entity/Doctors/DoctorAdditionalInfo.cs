using HealthCareDomain.Entity.Appointment;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareDomain.Entity.Doctors
{
    public class DoctorAdditionalInfo
    {
        [Key]
        [ForeignKey("Doctor")]
        public string Id { get; set; }
        public Doctor Doctor { get; set; }

        public string? ExperienceDetail { get; set; }
        public string? Trainings { get; set; }
    }
}
