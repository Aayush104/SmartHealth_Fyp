using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.Contract.ContractDto.ChatDto
{
    public class GetMessageDto
    {

        public int MessageId { get; set; }
        public string? SenderId { get; set; }
        public string? MessageContent { get; set; }
        public DateTime? SentAt { get; set; }
        public IEnumerable<GetFileDto>? getFile { get; set; }
    }
}
