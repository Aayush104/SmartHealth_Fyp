using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.Contract.ContractDto.ChatDto
{
    public class GetFileDto
    {
        public string? FilePath { get; set; }
        public string? FileType { get; set; }
        public DateTime? UploadedAt { get; set; }
    }
}
