using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareDomain.Entity.Doctors
{
    public class DoctorAvailability
    {
        [Key]
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public string StartTime { get; set; }

        public string EndTime { get; set; }

        public int SlotDuration { get; set; }

        public bool IsBooked { get; set; }

        [ForeignKey("DoctorId")]
        public virtual Doctor Doctor { get; set; }

        public string DoctorId { get; set; }  
    }
}
