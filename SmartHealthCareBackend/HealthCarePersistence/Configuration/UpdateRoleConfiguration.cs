using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HealthCarePersistence.Configuration
{
    public class UserRoleConfiguration : IEntityTypeConfiguration<IdentityUserRole<string>>
    {
        public void Configure(EntityTypeBuilder<IdentityUserRole<string>> builder)
        {
            builder.HasData(
                new IdentityUserRole<string>
                {
                    UserId = "25160704-4676-4ea0-8bf2-cffbfea196db",   //Aayush ko UserId
                    RoleId = "ed2c2821-7372-44fa-86e5-10c97a782b29"   //Admin ko Id from role Table
                }
            );
        }
    }
}
