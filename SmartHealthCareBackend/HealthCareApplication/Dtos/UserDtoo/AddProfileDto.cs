using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.UserDto
{
    public class AddProfileDto
    {

        public string userId { get; set; }
        public IFormFile? Profile { get; set; }
        public string? Profileget { get; set; }
        public string? Experience { get; set; }
        public string? FromDay { get; set; }  
        public string? ToDay { get; set; } 
        public string? FromTime { get; set; }  
        public string? ToTime { get; set; }
     
        public string? Description { get; set; }
        public string? Fee { get; set; }
    }
}
