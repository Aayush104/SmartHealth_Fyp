using System;
using System.ComponentModel.DataAnnotations;

namespace HealthCareDomain.Entity.Announcement
{
    public class Announce
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; }

        public bool IsMarked { get; set; } = false; 

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
