using HealthCareApplication.Dtos.UserDtoo;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.UserDto
{
    public class DoctorDetailsDto : AddProfileDto
    {

   public string? Id { get; set; }
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

        public string? FromDay { get; set; }
        public string? ToDay { get; set; }
        public string? FromTime { get; set; }
        public string? ToTime { get; set; }

        public bool? IsBlocked { get; set; }
        public List<AdditionalnfoDto> AdditionalInfo { get; set; }



    }
}
