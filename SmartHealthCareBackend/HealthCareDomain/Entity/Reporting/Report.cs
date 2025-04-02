using HealthCareDomain.Entity.Patients;
using HealthCareDomain.Entity.UserEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.Entity.Reporting
{
    public class Report
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string ReportType { get; set; }

        [Required]
        [StringLength(100)]
        public string Category { get; set; }

        [Required]
        public string Urgency { get; set; }

        [Required]
        [StringLength(200)]
        public string Subject { get; set; }

        [Required]
        public string Description { get; set; }

        public string? Photo { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }

        public virtual ApplicationUser User { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
