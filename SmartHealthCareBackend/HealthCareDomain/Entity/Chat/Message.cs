using HealthCareDomain.Entity.UserEntity;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.Entity.Chat
{
    public class Message
    {

        [Key]
        public int Id { get; set; }

        public int? ConversationId { get; set; }

        public string? SenderId { get; set; }

        public string? MessageContent { get; set; }

        public DateTime? SentAt { get; set; }

        public virtual ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();

        public virtual Conversation? Conversation { get; set; }

        public virtual ICollection<MessageStatus> MessageStatuses { get; set; } = new List<MessageStatus>();

        public virtual ApplicationUser? Sender { get; set; }
    }
}
