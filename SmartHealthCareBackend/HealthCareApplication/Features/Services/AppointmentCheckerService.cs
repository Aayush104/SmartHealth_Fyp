
using HealthCareDomain.IRepository;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace HealthCareApplication.Features.Services
{
    public class AppointmentCheckerService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
       
        private readonly ILogger<AppointmentCheckerService> _logger;

        public AppointmentCheckerService(
            IServiceProvider serviceProvider,
           
            ILogger<AppointmentCheckerService> logger)
        {
            _serviceProvider = serviceProvider;
          
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var appointmentRepository = scope.ServiceProvider.GetRequiredService<IBookAppointmentRepository>();
                        var appointments = await appointmentRepository.GetUpcomingAppointments();

                        var currentTime = DateTime.Now; // Current time for comparison

                        foreach (var appointment in appointments)
                        {
                            var slotTime = TimeSpan.Parse(appointment.Slot);
                            var endTime = !string.IsNullOrEmpty(appointment.EndTime) ? TimeSpan.Parse(appointment.EndTime) : TimeSpan.MaxValue;

                           
                            if (currentTime.TimeOfDay >= slotTime && currentTime.TimeOfDay < endTime)
                            {
                                if (!appointment.IsButtonEnabled)
                                {
                                    await appointmentRepository.UpdateAppointmentStatus(appointment.Id, true);
                                    _logger.LogInformation($"Enabled button for appointment {appointment.Id}");
                                }
                            }
                           
                            else if (currentTime.TimeOfDay >= endTime)
                            {
                                // Update if button is not disabled already
                                if (appointment.IsButtonEnabled)
                                {
                                    await appointmentRepository.UpdateAppointmentStatus(appointment.Id, false);
                                    _logger.LogInformation($"Disabled button for appointment {appointment.Id}");
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in AppointmentCheckerService");
                }

                // Delay between checks
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
        }
    }
}
