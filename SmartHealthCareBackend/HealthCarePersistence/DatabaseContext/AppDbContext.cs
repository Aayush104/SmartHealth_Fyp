using System;
using System.Linq;

using System.Threading;
using System.Threading.Tasks;
using HealthCareDomain.Entity.Announcement;
using HealthCareDomain.Entity.Appointment;
using HealthCareDomain.Entity.Chat;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Otp;
using HealthCareDomain.Entity.Patients;
using HealthCareDomain.Entity.Review;
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

        public DbSet<ApplicationUser> Users { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<OtpHash> Otps { get; set; }
        public DbSet<DoctorAvailability> DoctorAvailabilities { get; set; }
        public DbSet<BookAppointment> BookAppointments { get; set; }
        public DbSet<DoctorAdditionalInfo> DoctorAdditionalInfos { get; set; }
        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<MessageStatus> MessageStatuses { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Comments> Comments { get; set; }
        public DbSet<Announce> Announces { get; set; }

        public DbSet<Reply> Replies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Patient>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.Id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Doctor>()
                .HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.Id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DoctorAdditionalInfo>()
                .HasOne(d => d.User)
                .WithMany(u => u.DoctorAdditionalInfos)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Comments>()
                .HasOne(d => d.Patients)
                .WithMany(u => u.Comments)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Comments>()
                .HasOne(d => d.Doctor)
                .WithMany(u => u.Comments)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OtpHash>()
                .HasOne(o => o.User)
                .WithMany(u => u.Otps)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BookAppointment>()
          .HasOne(b => b.Doctor)
          .WithMany(d => d.BookAppointments)
          .HasForeignKey(b => b.DoctorId);

         
            modelBuilder.Entity<BookAppointment>()
                .HasOne(b => b.Patient)
                .WithMany(p => p.BookAppointments)
                .HasForeignKey(b => b.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Appointment)
                .WithMany(a => a.Payments)
                .HasForeignKey(p => p.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);

           
            modelBuilder.Entity<Attachment>()
              .HasOne(a => a.Message)
              .WithMany(m => m.Attachments)
              .HasForeignKey(a => a.MessageId)
              .OnDelete(DeleteBehavior.Cascade);

         
            modelBuilder.Entity<Conversation>()
                .HasMany(c => c.Messages)
                .WithOne(m => m.Conversation)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Conversation)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany()
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

           
            modelBuilder.Entity<MessageStatus>()
                .HasOne(ms => ms.Message)
                .WithMany(m => m.MessageStatuses)
                .HasForeignKey(ms => ms.MessageId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MessageStatus>()
                .HasOne(ms => ms.User)
                .WithMany()
                .HasForeignKey(ms => ms.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Reply>()
         .HasOne(r => r.Comment)
         .WithMany(c => c.Replies)  
         .HasForeignKey(r => r.CommentId)
         .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Reply>()
                .HasOne(r => r.Doctor)
                .WithMany(d => d.Replies)  
                .HasForeignKey(r => r.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }

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
