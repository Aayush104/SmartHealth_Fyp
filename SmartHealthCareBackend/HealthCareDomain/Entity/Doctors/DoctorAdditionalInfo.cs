using HealthCareDomain.Entity.UserEntity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareDomain.Entity.Doctors
{
    public class DoctorAdditionalInfo
    {
        [Key]
        public string Id { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public string? ExperienceDetail { get; set; }
        public string? Trainings { get; set; }
    }
}
