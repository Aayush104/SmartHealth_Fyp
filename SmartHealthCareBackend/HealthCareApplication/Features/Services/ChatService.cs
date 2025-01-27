using HealthCareApplication.Contract.IService;
using HealthCareApplication.Contracts.IService;
using HealthCareApplication.Dtos.UserDto;
using HealthCareDomain.Contract.ContractDto.ChatDto;
using HealthCareDomain.Entity.Chat;
using HealthCareDomain.Entity.Patients;
using HealthCareDomain.IRepository;
using HealthCarePersistence.Repository;
using System;
using System.Collections.Generic;
using System.Linq;

using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Features.Services
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;
        private readonly IFileService _fileService;

        public ChatService(IChatRepository chatRepository, IFileService fileService)
        {
            _chatRepository = chatRepository;
            _fileService = fileService;
        }

        public async Task<ApiResponseDto> GetMessagesAsync(string senderId, string receiverId)
        {
            if (string.IsNullOrEmpty(senderId) || string.IsNullOrEmpty(receiverId))
            {
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "One Of the Id not found",
                    StatusCode = 404
                };

            }
                try
                {
                var response = await _chatRepository.GetMessagesAsyncc(senderId, receiverId);

                return new ApiResponseDto
                {
                    IsSuccess = true,
                    Message = "Messages fetched successfully",
                    StatusCode = 200,
                    Data = response
                };
            }
                catch (Exception ex)
                {
                    // Handle internal server errors
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = $"Internal server error: {ex.Message}",
                        StatusCode = 500
                    };
                }
            }
       

        public async Task<ApiResponseDto> GetUserListAsync(string Id, string role)
        {
            // Validate input parameters
            if (string.IsNullOrEmpty(Id) || string.IsNullOrEmpty(role))
            {
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "Role or Id not found",
                    StatusCode = 404
                };
            }

            try
            {
                // Check if the role is "Patient"
                if (role.Equals("Patient", StringComparison.OrdinalIgnoreCase))
                {
                    var patients = await _chatRepository.GetPatientListAsync(Id); 

                    return new ApiResponseDto
                    {
                        IsSuccess = true,
                        Message = "Patient list fetched successfully",
                        StatusCode = 200,
                        Data = patients
                    };
                }

                // Check if the role is "Doctor"
                if (role.Equals("Doctor", StringComparison.OrdinalIgnoreCase))
                {
                    var doctors = await _chatRepository.GetDoctorListAsync(Id); 

                    return new ApiResponseDto
                    {
                        IsSuccess = true,
                        Message = "Doctor list fetched successfully",
                        StatusCode = 200,
                        Data = doctors
                    };
                }

                // Handle the case where the role is not valid
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid role provided",
                    StatusCode = 400
                };
            }
            catch (Exception ex)
            {
                // Handle internal server errors
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = $"Internal server error: {ex.Message}",
                    StatusCode = 500
                };
            }
        }

    


        public async Task<Message> SendMessageAsync(string senderId, string receiverId, string message, string base64data)
        {
            // Check if a conversation exists indirectly via GetMessagesAsync
            var conversation = await _chatRepository.GetConversationByParticipantsAsync(senderId, receiverId);

            if (conversation == null)
            {
                // If no conversation exists, create a new one
                conversation = new Conversation
                {
                    SenderId = senderId,
                    ReceiverId = receiverId,
                    CreatedAt = DateTime.UtcNow // Use UTC for consistency
                };

                await _chatRepository.CreateConversationAsync(conversation);
            }

            // Create the new message
            var newMessage = new Message
            {
                ConversationId = conversation.Id,
                SenderId = senderId,
                MessageContent = message,
                SentAt = DateTime.UtcNow // Use UTC for consistency
            };

            // Save the new message
            await _chatRepository.CreateMessageAsync(newMessage);

            // Handle the attachment if base64data is provided
            if (!string.IsNullOrEmpty(base64data))
            {
                var fileType = base64data.Split(';')[0].Split('/')[1]; // e.g., "image/jpeg" -> "jpeg"
                var base64Content = base64data.Split(',')[1]; // Remove the prefix (e.g., "data:image/jpeg;base64,")
                var fileBytes = Convert.FromBase64String(base64Content);

                // Generate a unique file name
                var fileName = $"{Guid.NewGuid()}.{fileType}";
                var filePath = Path.Combine("wwwroot/MessageFile", fileName);

                // Ensure the directory exists
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                // Save the file to the server
                await File.WriteAllBytesAsync(filePath, fileBytes);

               
                var fileUrl = $"https://localhost:7070/MessageFile/{fileName}";

                // Create an attachment entity
                var attachment = new Attachment
                {
                    FilePath = fileUrl,
                    FileType = fileType,
                    UploadedAt = DateTime.UtcNow, // Use UTC for consistency
                    MessageId = newMessage.Id
                };

                // Save the attachment to the database
                await _chatRepository.CreateAttachmentAsync(attachment);
            }

            // Return the new message
            return newMessage;
        }

    }

}

