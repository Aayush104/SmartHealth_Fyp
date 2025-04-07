using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.NotificationHub
{
    public class Notificationhub : Hub
    {
        public async Task SendNotification(string message)
        {
            await Clients.All.SendAsync("ReceiveNotification", message);
        }

        public async Task SendAdminNotification(object notification)
        {
            await Clients.All.SendAsync("ReceiveNotificationForAdmin", notification);
        }
    }
}
