using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.AppointmentHub
{
    public class Appointmenthub : Hub 
    {
        public async Task NotifyAppointmentStatusChange(int appointmentId, bool isButtonEnabled)
        {
            await Clients.All.SendAsync("ReceiveAppointmentStatusChange", appointmentId, isButtonEnabled);
        }
    }
}
