using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Patients;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.Entity.Review
{
    public class Reply
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Comment")]
        public int CommentId { get; set; }  
        public Comments Comment { get; set; }

        [ForeignKey("Doctor")]
        public string DoctorId { get; set; } 
        public Doctor Doctor { get; set; }

        [MaxLength(1000)]
        public string ReplyText { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}
