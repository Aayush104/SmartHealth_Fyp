using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.Entity.Chat
{
 public class Conversation
    {


        [Key]
        public int Id { get; set; }

        public string SenderId { get; set; }

        public string ReceiverId { get; set; }

        public DateTime? CreatedAt { get; set; }

        public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}
