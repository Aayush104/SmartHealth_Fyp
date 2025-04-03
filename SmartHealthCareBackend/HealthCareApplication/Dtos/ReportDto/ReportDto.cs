using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.ReportDto
{
    public class ReportDto
    {

        [Required]
        [StringLength(100)]
        public string Category { get; set; }

        [Required]
        public string Urgency { get; set; }  
        
        [Required]
        public string ReportType { get; set; }

        [Required]
        [StringLength(200)]
        public string Subject { get; set; }

        [Required]
        public string Description { get; set; }

  
        public IFormFile? Photo { get; set; }

        public string UserId { get; set; }
    }
}
