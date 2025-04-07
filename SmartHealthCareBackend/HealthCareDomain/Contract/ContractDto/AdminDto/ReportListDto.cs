using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.Contract.ContractDto.AdminDto
{
    public class ReportListDto
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


        public string UserName { get; set; }

        public string? Profileget { get; set;}

        public string? Specialization { get; set; }
        public string? Role { get; set; }

        public bool MarkAs { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
