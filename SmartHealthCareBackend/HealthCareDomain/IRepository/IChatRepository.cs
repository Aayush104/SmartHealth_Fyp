using HealthCareApplication.Dtos.ChatDto;
using HealthCareDomain.Contract.ContractDto.ChatDto;
using HealthCareDomain.Entity.Chat;
using HealthCareDomain.Entity.UserEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.IRepository
{
    public interface IChatRepository
    {
        Task <List<UserListDto>> GetPatientListAsync(string userId);
        Task <List<UserListDto>> GetDoctorListAsync(string userId);
        Task <List<GetMessageDto>> GetMessagesAsyncc(string senderId, string receiverId);
        Task CreateConversationAsync(Conversation conversation);
        Task<Message> CreateMessageAsync(Message message);

        Task<Conversation> GetConversationByParticipantsAsync(string senderId, string receiverId);

        Task CreateAttachmentAsync(Attachment uploadedFiles);
    }
}
