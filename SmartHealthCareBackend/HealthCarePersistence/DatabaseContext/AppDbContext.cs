using HealthCareDomain.Entity.Appointment;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Otp;
using HealthCareDomain.Entity.Patients;
using HealthCareDomain.Entity.UserEntity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace HealthCarePersistence.DatabaseContext
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSet properties for your entities
        public DbSet<ApplicationUser> Users { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<OtpHash> Otps { get; set; }
        public DbSet<DoctorAvailability> DoctorAvailabilities { get; set; }
        public DbSet<BookAppointment> BookAppointments { get; set; }
        public DbSet<DoctorAdditionalInfo> DoctorAdditionalInfos { get; set; } 
        public DbSet<Payment> Payments { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Patient relationship with ApplicationUser
            modelBuilder.Entity<Patient>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.Id)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Doctor relationship with ApplicationUser
            modelBuilder.Entity<Doctor>()
                .HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.Id)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure DoctorAdditionalInfo relationship with ApplicationUser
            modelBuilder.Entity<DoctorAdditionalInfo>()
      .HasOne(d => d.User)
      .WithMany(u => u.DoctorAdditionalInfos)
      .HasForeignKey(d => d.UserId)
      .OnDelete(DeleteBehavior.Cascade);




            // Configure OtpHash relationship with ApplicationUser
            modelBuilder.Entity<OtpHash>()
                .HasOne(o => o.User)
                .WithMany(u => u.Otps)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure BookAppointment relationships
            modelBuilder.Entity<BookAppointment>()
                .HasOne(b => b.Doctor)
                .WithMany(d => d.BookAppointments)
                .HasForeignKey(b => b.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BookAppointment>()
                .HasOne(b => b.Patient)
                .WithMany(p => p.BookAppointments)
                .HasForeignKey(b => b.PatientId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Payment>()
         .HasOne(p => p.Appointment)
        .WithMany(b => b.Payments)  
        .HasForeignKey(p => p.AppointmentId) 
        .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }

        // Override SaveChangesAsync to handle timestamps for ApplicationUser
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entity in ChangeTracker.Entries<ApplicationUser>()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified))
            {
                entity.Entity.UpdatedAt = DateTime.UtcNow;

                if (entity.State == EntityState.Added)
                {
                    entity.Entity.CreatedAt = DateTime.UtcNow;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
