using HealthCareDomain.Entity.Review;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.NotificationDto
{
    public class Notificationdto
    {
        public string DoctorId { get; set; }

        public string UserName { get; set; }    

        public string ReviewText { get; set; }

        public DateTime CreatedAt { get; set; } 

        public CommentStatus MarkAs { get; set; }
    }
}
