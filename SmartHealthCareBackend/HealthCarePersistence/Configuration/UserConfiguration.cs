using HealthCareDomain.Entity.UserEntity;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCarePersistence.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<ApplicationUser> 
    {
        public void Configure(EntityTypeBuilder<ApplicationUser> builder)
        {
            var hasher = new PasswordHasher<ApplicationUser>();

            builder.HasData(
                 new ApplicationUser
                 {
                     Id = "25160704-4676-4ea0-8bf2-cffbfea196db",
                     UserName = "Admin",
                     NormalizedUserName = "ADMIN",
                     FullName = "Admin",
                     Email = "aayushadhikari601@gmail.com",
                     NormalizedEmail = "AAYUSHADHIKARI601@GMAIL.COM",
                     EmailConfirmed = true,
                     PasswordHash = hasher.HashPassword(null, "Admin@123"),
                     PhoneNumber = "9827102964",
                     CreatedAt = DateTime.UtcNow,
                     UpdatedAt = DateTime.UtcNow
                 });

            builder.HasKey(x => x.Id);

        }
    }
}
