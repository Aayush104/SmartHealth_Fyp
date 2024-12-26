using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.UserDtoo
{
    public class AdditionalnfoDto
    {
        public string UserId { get; set; }
        public List<string>? Experiences { get; set; }
        public List<string>? Trainings { get; set; }
    }
}
