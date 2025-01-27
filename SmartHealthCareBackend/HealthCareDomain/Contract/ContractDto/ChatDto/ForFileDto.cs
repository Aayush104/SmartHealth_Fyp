using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.Contract.ContractDto.ChatDto
{
    public class ForFileDto
    {
        public string ReceiverId { get; set; }

        public string ? message { get; set; }

        public List<IFormFile> Attachments { get; set; }

        public string? Attachmentsget { get; set; }
    }

}
