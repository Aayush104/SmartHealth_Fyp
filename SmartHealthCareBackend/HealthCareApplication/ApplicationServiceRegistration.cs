using HealthCareApplication.Contract.IService;
using HealthCareApplication.Contracts.Email;
using HealthCareApplication.Contracts.IService;
using HealthCareApplication.Features.Services;
using HealthCareDomain.IServices;
using HealthCareInfrastructure.DataSecurity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace HealthCareApplication
{
    public static class ApplicationServiceRegistration
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {

            var JWT_SECRET = Environment.GetEnvironmentVariable("JWT_SECRET");
            var JWT_AUDIENCE = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
            var JWT_ISSUER = Environment.GetEnvironmentVariable("JWT_ISSUER");
           
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<IDoctorService, DoctorService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<IOtpService, OtpService>();
            services.AddScoped<IDoctorAvailabiltyService,DoctorAvailabilityService>();
            services.AddScoped<IAppointmentService, AppointmentService>();
            services.AddScoped<DataSecurityProvider>();
            services.AddSingleton<ITokenService, TokenService>();


            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })


            .AddJwtBearer(Options =>
             {
                 Options.SaveToken = true;
                 Options.RequireHttpsMetadata = false;
                 Options.TokenValidationParameters = new TokenValidationParameters
                 {
                     ValidateIssuer = true,
                     ValidateAudience = true,
                     ValidIssuer = JWT_ISSUER,
                     ValidAudience = JWT_AUDIENCE,
                     ClockSkew = TimeSpan.Zero,
                     IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWT_SECRET))
                 };
             });

            return services;
        }
    }
}
  