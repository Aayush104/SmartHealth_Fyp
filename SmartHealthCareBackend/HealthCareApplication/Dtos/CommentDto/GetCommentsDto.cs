using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.CommentDto
{
    public class GetCommentsDto
    {


    public int? CommentId { get; set; }
        public string UserName { get; set; }
        public string VisitedFor { get; set; }
        public bool IsRecommended { get; set; }

        [MaxLength(1000)]
        public string ReviewText { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
