using HealthCareApplication.Contract.IService;
using Microsoft.AspNetCore.SignalR;

namespace HealthCareApi.Chathub
{
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;
        public ChatHub(IChatService chatService) 
        {
            _chatService = chatService;

        }

        public async Task SendMessage(string senderId, string receiverId, string message)
        {
            var sentmessage = await _chatService.SendMessageAsync(senderId, receiverId, message);

            await Clients.All.SendAsync("ReceiveMessage", sentmessage.SenderId, sentmessage.MessageContent);
            //await Clients.Users(senderId, receiverId).SendAsync("ReceiveMessage", sentmessage.SenderId, sentmessage.MessageContent, sentmessage.SentAt);

        }
    }
}
