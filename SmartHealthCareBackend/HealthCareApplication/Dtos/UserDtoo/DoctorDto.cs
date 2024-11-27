using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.UserDto
{
    public class DoctorDto : UserDto    
    {
        [Required]
        public string Specialization { get; set; }
        public string Location { get; set; }

        public string LicenseNumber { get; set; }

        public string Qualifications { get; set; }

        public IFormFile? LicenseFile { get; set; }
        public IFormFile?  QualificationsFile { get; set; }
        public IFormFile? GovernmentIdFile { get; set; }

    }
}
