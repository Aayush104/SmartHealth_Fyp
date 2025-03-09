using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Review;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.CommentDto
{
    public class ReplyDto
    {

        public int CommentId { get; set; }
        public string? DoctorId { get; set; }
        public string? ReplyText { get; set; }

         public DateTime CreatedAt { get; set; }

    }
}
