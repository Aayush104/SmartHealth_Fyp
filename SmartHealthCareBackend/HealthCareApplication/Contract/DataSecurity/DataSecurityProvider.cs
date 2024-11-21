using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareInfrastructure.DataSecurity
{
    public class DataSecurityProvider
    {
        public string securityKey = Environment.GetEnvironmentVariable("SECURITY_KEY");
    }
}
