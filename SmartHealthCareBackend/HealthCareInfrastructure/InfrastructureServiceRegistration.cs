using HealthCareApplication.Contracts.Email;
using HealthCareApplication.Features.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareInfrastructure
{
    public static class InfrastructureServiceRegistration
    {
        public static IServiceCollection AddInfrastructureService (this IServiceCollection service)
        {
            service.AddTransient<IMailService, MailService>();

            return service; 
        }
    }
}
