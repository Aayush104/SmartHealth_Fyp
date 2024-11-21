using HealthCareDomain.Entity.Appointment;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Otp;
using HealthCareDomain.Entity.Patients;
using HealthCareDomain.Entity.UserEntity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

         
            modelBuilder.Entity<Patient>()
                .HasOne(p => p.User)
                .WithMany()  // No inverse relationship needed
                .HasForeignKey(p => p.Id)
                .OnDelete(DeleteBehavior.Cascade);  // Cascade delete on user deletion

            // Configure Doctor relationship with ApplicationUser
            modelBuilder.Entity<Doctor>()
                .HasOne(d => d.User)
                .WithMany()  // No inverse relationship needed
                .HasForeignKey(d => d.Id)
                .OnDelete(DeleteBehavior.Cascade);  // Cascade delete on user deletion

            // Configure OtpHash relationship with ApplicationUser
            modelBuilder.Entity<OtpHash>()
                .HasOne(o => o.User)
                .WithMany(u => u.Otps)  // User can have many OTPs
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);  // Cascade delete OTPs when User is deleted

            
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
