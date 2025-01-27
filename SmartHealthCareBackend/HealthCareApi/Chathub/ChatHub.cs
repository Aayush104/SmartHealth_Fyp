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

        public async Task SendMessage(string senderId, string receiverId, string message, string base64data)
        {
            var sentmessage = await _chatService.SendMessageAsync(senderId, receiverId, message, base64data);

            // Ensure that Attachments is not null and has at least one item
            var filePath = sentmessage.Attachments?.FirstOrDefault()?.FilePath;

            await Clients.All.SendAsync("ReceiveMessage", sentmessage.SenderId, sentmessage.MessageContent, filePath);
        }
    }
}