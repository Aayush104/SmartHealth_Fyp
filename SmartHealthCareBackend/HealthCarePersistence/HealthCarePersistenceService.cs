
using HealthCareDomain.IRepository;
using HealthCarePersistence.DatabaseContext;
using HealthCarePersistence.IRepository;
using HealthCarePersistence.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HealthCarePersistence
{
    public static class HealthCarePersistenceServiceExtensions
    {
        public static IServiceCollection AddHealthCarePersistence(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                var connectionString = configuration.GetConnectionString("Conn");
                options.UseSqlServer(connectionString);
            });

            services.AddScoped<IPatientRepository, PatientRepository>();
            services.AddScoped<IDoctorRepository, DoctorRepository>();
            services.AddScoped<IOtpRepository, OtpRepository>();
            services.AddScoped<IDoctorAvailabilityRepository, DoctorAvailabilityRepository>();
            services.AddScoped<IBookAppointmentRepository, BookAppointmentRepository>();
            services.AddScoped<IChatRepository, ChatRepository>();
            return services;
        }
    }
}
