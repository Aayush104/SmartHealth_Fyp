using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.UserDto
{
    public class PatientDto : UserDto
    {


        public DateOnly? DateOfBirth { get; set; }
        public string? MedicalHistory { get; set; }

    }
}
