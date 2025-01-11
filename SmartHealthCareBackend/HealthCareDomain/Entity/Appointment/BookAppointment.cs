using System;
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

        
        [Required]
        [ForeignKey("Patient")]
        public string PatientId { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        [Required]
        public string Slot { get; set; }  

        [Required]
        [MaxLength(50)]
        public string Status { get; set; }

        [Required]
        [MaxLength(50)]
        public string PaymentStatus { get; set; }

    
        public virtual Doctor Doctor { get; set; }

        
        public virtual Patient Patient { get; set; }

        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
