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
      


    }
}
