using HealthCareDomain.Entity.UserEntity;
using HealthCareDomain.IRepository;
using HealthCarePersistence.DatabaseContext;
using HealthCareApplication.Dtos.ChatDto; // Ensure this is included
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using HealthCareDomain.Contract.ContractDto.ChatDto;
using HealthCareDomain.Entity.Chat;
//using System.Data.Entity;

namespace HealthCarePersistence.Repository
{
    public class ChatRepository : IChatRepository
    {
        private readonly AppDbContext _dbContext;

        public ChatRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async  Task CreateConversationAsync(Conversation conversation)
        {
            await _dbContext.Conversations.AddAsync(conversation);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Message> CreateMessageAsync(Message message)
        {
            await _dbContext.Messages.AddAsync(message);
            await _dbContext.SaveChangesAsync();
            return message;
        }

       

        public async Task<List<UserListDto>> GetDoctorListAsync(string userId)
        {
            var response = await _dbContext.BookAppointments
                .Where(t => t.DoctorId == userId)
                .Include(x => x.Patient)
                .ThenInclude(patient => patient.User)
                .Select(x => new UserListDto
                {
                    Id = x.Patient.User.Id,
                    Name = x.Patient.User.FullName,
                    
                })
                .GroupBy(x => x.Id) 
                .Select(group => group.First()) 
                .ToListAsync();

            return response;
        }

        public async Task<List<GetMessageDto>> GetMessagesAsyncc(string senderId, string receiverId)
        {
            var response = await _dbContext.Conversations
                 .AsNoTracking()
                .Include(c => c.Messages)
                .FirstOrDefaultAsync(c =>
                    (c.SenderId == senderId && c.ReceiverId == receiverId) ||
                    (c.SenderId == receiverId && c.ReceiverId == senderId));

            if (response != null)
            {
                var messageDtos = response.Messages
                    .OrderBy(m => m.SentAt)
                    .Select(m => new GetMessageDto
                    {
                        MessageId = m.Id, 
                        MessageContent = m.MessageContent,
                        SentAt = m.SentAt,
                        SenderId = m.SenderId
                    }).ToList();

                return messageDtos;
            }

            return new List<GetMessageDto>();
        }


        public async Task<List<UserListDto>> GetPatientListAsync(string userId)
        {
            var response = await _dbContext.BookAppointments
                .Where(t => t.PatientId == userId)
                .Include(x => x.Doctor)
                .ThenInclude(doctor => doctor.User)
                .Select(x => new UserListDto
                {
                    Id = x.Doctor.User.Id,
                    Name = x.Doctor.User.FullName,
                    Profile = x.Doctor.Profile
                })
                .GroupBy(x => x.Id) 
                .Select(group => group.First()) 
                .ToListAsync();

            return response;
        }


        public async Task<Conversation> GetConversationByParticipantsAsync(string senderId, string receiverId)
        {
            var conversation = await _dbContext.Conversations
        .Where(c => (c.SenderId == senderId && c.ReceiverId == receiverId) || (c.SenderId == receiverId && c.ReceiverId == senderId))
        .FirstOrDefaultAsync();

            return conversation;
        }
    }
}
