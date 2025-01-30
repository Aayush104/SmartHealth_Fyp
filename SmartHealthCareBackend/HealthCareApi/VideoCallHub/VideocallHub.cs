using Microsoft.AspNetCore.SignalR;
using HealthCareApplication.Contract.IService;

namespace HealthCareApi.VideoCallHub
{
    public class VideocallHub : Hub
    {
        private readonly IConnectionService _connectionService;

        public VideocallHub(IConnectionService connectionService)
        {
            _connectionService = connectionService;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.GetHttpContext().Request.Query["userId"].ToString();
            _connectionService.AddConnection(userId, Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            _connectionService.RemoveConnection(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }


        public async Task NotifyIncomingCall(string receiverId, string callerId, string callerName)
        {
            var connectionId = _connectionService.GetConnection(receiverId);
            if (connectionId != null)
            {
                await Clients.Client(connectionId).SendAsync("IncomingCall", callerId, callerName);
            }
        }


        public async Task RejectCall(string callerId)
        {
            var connectionId = _connectionService.GetConnection(callerId);
            if (connectionId != null)
            {
                await Clients.Client(connectionId).SendAsync("CallRejected");
            }
        }

        public async Task SendSignal(string receiverId, object signalData)
        {
            var connectionId = _connectionService.GetConnection(receiverId);
            if (connectionId != null)
            {
                await Clients.Client(connectionId).SendAsync("ReceiveSignal", signalData);
            }
        }
    }
}
