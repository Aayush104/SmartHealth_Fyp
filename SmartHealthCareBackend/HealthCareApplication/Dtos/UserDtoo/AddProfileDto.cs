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
        public string? Location { get; set; }
        public string? Experience { get; set; }
        public string? Availability { get; set; }
    }
}
