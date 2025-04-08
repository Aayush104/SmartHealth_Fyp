using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.VideoDto
{
    public class VideoUploadDto
    {
        public IFormFile Video { get; set; }
        public string meetingId { get; set; }
    }
}
