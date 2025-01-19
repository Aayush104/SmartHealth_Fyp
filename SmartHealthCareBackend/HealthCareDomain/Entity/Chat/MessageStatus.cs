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
    public class MessageStatus
    {

        [Key]
        public int Id { get; set; }

        public int? MessageId { get; set; }

        public string? UserId { get; set; }

        public string? Status { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public virtual Message? Message { get; set; }

        public virtual ApplicationUser? User { get; set; }
    }
}

