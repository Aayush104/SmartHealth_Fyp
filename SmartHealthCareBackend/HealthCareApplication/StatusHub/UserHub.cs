using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.StatusHub
{
    public class UserHub : Hub
    {
        public async Task AddUserToGroup(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        }

       
        public async Task NotifyUserLogout(string userId)
        {
            await Clients.Group(userId).SendAsync("Logout");
        }
    }
}