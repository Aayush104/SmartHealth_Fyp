using Microsoft.AspNetCore.SignalR;

namespace HealthCareApi.MeetingHub
{
    public class MeetingHub : Hub
    {
        public async Task JoinRoom(string meetingId)
        {
            if (string.IsNullOrEmpty(meetingId))
            {
                throw new HubException("Meeting ID is required.");
            }
            await Groups.AddToGroupAsync(Context.ConnectionId, meetingId);
            await Clients.Group(meetingId).SendAsync("UserJoined", Context.ConnectionId);
        }

        public async Task LeaveRoom(string meetingId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, meetingId);
            await Clients.Group(meetingId).SendAsync("UserLeft", Context.ConnectionId);
        }

        public async Task SendOffer(string meetingId, string offer)
        {
            await Clients.OthersInGroup(meetingId).SendAsync("ReceiveOffer", Context.ConnectionId, offer);
        }

        public async Task SendAnswer(string meetingId, string answer)
        {
            await Clients.OthersInGroup(meetingId).SendAsync("ReceiveAnswer", Context.ConnectionId, answer);
        }

        public async Task SendIceCandidate(string meetingId, string candidate)
        {
            await Clients.OthersInGroup(meetingId).SendAsync("ReceiveIceCandidate", Context.ConnectionId, candidate);
        }
    }
}
