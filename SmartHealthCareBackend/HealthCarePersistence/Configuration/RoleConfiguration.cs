
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HealthCarePersistence.Configuration
{
    public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
    {
        public void Configure(EntityTypeBuilder<IdentityRole> builder)
        {
            builder.HasData(
                new IdentityRole
                {
                    Id = "ed2c2821-7372-44fa-86e5-10c97a782b29", 
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole
                {
                    Id = "8d21ee45-715f-4499-8d15-81d8ccf124ee", 
                    Name = "Patient",
                    NormalizedName = "PATIENT"
                },
                new IdentityRole
                {
                    Id = "ce6c2f19-62e5-4721-b40a-a0a9399a6251",
                    Name = "Doctor",
                    NormalizedName = "DOCTOR"
                }
            );
        }
    }
}
