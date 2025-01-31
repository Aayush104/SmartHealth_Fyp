using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Patients;

namespace HealthCareDomain.Entity.Appointment
{
    public class BookAppointment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Doctor")]
        public string DoctorId { get; set; }
        public virtual Doctor Doctor { get; set; }

        [Required]
        [ForeignKey("Patient")]
        public string PatientId { get; set; }
        public virtual Patient Patient { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        [Required]
        [MaxLength(50)]
        public string Slot { get; set; }

        public string? EndTime { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; }

        public bool IsButtonEnabled { get; set; } = false;

        [Required]
        [MaxLength(50)]
        public string PaymentStatus { get; set; }

        public string MeetingId { get; set; } = Guid.NewGuid().ToString();  

        public bool MeetingIdValidation { get; set; } = true;

        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
