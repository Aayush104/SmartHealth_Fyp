using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Patients;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareDomain.Entity.Review
{
    public enum CommentStatus
    {
        Read,
        Unread
    }

    public class Comments
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Patient")]
        public string PatientId { get; set; }
        public virtual Patient Patients { get; set; }

        public string UserName { get; set; }

        [ForeignKey("Doctor")]
        public string DoctorId { get; set; }
        public virtual Doctor Doctor { get; set; }

        public string VisitedFor { get; set; }
        public bool IsRecommended { get; set; }

        [MaxLength(1000)]
        public string ReviewText { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public CommentStatus MarkAs { get; set; } = CommentStatus.Unread;

        public virtual ICollection<Reply> Replies { get; set; } = new List<Reply>();
    }
}
