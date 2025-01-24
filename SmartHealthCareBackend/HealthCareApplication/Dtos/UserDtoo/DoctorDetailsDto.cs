using HealthCareApplication.Dtos.UserDtoo;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.UserDto
{
    public class DoctorDetailsDto : AddProfileDto
    {

   
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Specialization { get; set; }
     
       public string Loction { get; set; }
        public string Qualifications { get; set; }
        public string Status { get; set; }

        public string phoneNumber { get; set; }

        public string? LicenseFile { get; set; }
        public string? QualificationsFile { get; set; }
        public string? GovernmentIdFile { get; set; }
        public List<AdditionalnfoDto> AdditionalInfo { get; set; }



    }
}
