using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.Entity.Chat
{
    public class Attachment
    {

        [Key]
        public int Id { get; set; }

        public int? MessageId { get; set; }

        public string? FilePath { get; set; }

        public string? FileType { get; set; }

        public DateTime? UploadedAt { get; set; }

        public virtual Message? Message { get; set; }
    }
}
