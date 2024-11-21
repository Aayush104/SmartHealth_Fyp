using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.UserDto
{
   public class ApiResponseDto
    {
       
            public bool IsSuccess { get; set; }
            public string Message { get; set; }
            public int StatusCode { get; set; }
            public object Data { get; set; } 
        

    }
}
