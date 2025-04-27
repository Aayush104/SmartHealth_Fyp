using Xunit;
using Moq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using HealthCareApplication.Features.Services;
using HealthCareDomain.IRepository;
using HealthCareApplication.Contracts.IService;
using HealthCareApplication.Dtos.UserDto;
using HealthCareDomain.Contract.ContractDto.ChatDto;
using HealthCareDomain.Entity.Chat;
using HealthCareApplication.Dtos.ChatDto;

namespace HealthCareApplication.Tests
{
    public class ChatServiceTests
    {
        private readonly Mock<IChatRepository> _chatRepoMock;
        private readonly Mock<IFileService> _fileServiceMock;
        private readonly ChatService _chatService;

        public ChatServiceTests()
        {
            _chatRepoMock = new Mock<IChatRepository>();
            _fileServiceMock = new Mock<IFileService>();
            _chatService = new ChatService(_chatRepoMock.Object, _fileServiceMock.Object);
        }

        [Fact]
        public async Task GetMessagesAsync_ReturnsMessagesSuccessfully()
        {
            // Arrange
            var senderId = "1";
            var receiverId = "2";
            var messages = new List<GetMessageDto> { new GetMessageDto { MessageContent = "Hi" } };

            _chatRepoMock.Setup(r => r.GetMessagesAsyncc(senderId, receiverId))
                         .ReturnsAsync(messages);

            // Act
            var result = await _chatService.GetMessagesAsync(senderId, receiverId);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(200, result.StatusCode);
            Assert.NotNull(result.Data);
        }

        [Fact]
        public async Task GetUserListAsync_ReturnsDoctorList_WhenRoleIsNotPatient()
        {
            // Arrange
            var doctorId = "1";
            var userList = new List<UserListDto>
    {
        new UserListDto { Id = "100", Name = "Dr. John", Profile = "doctor-profile.png" }
    };

            _chatRepoMock.Setup(r => r.GetDoctorListAsync(doctorId))
                         .ReturnsAsync(userList);

            // Act
            var result = await _chatService.GetUserListAsync(doctorId, "Doctor");

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(200, result.StatusCode);

            var userData = result.Data as List<UserListDto>;
            Assert.NotNull(userData);
            Assert.Equal("Dr. John", userData[0].Name);
            Assert.Equal("doctor-profile.png", userData[0].Profile);
        }

        [Fact]
        public async Task GetUserListAsync_ReturnsPatientList_WhenRoleIsPatient()
        {
            // Arrange
            var patientId = "2";
            var userList = new List<UserListDto>
    {
        new UserListDto { Id = "200", Name = "Jane Patient", Profile = "patient-profile.png" }
    };

            _chatRepoMock.Setup(r => r.GetPatientListAsync(patientId))
                         .ReturnsAsync(userList);

            // Act
            var result = await _chatService.GetUserListAsync(patientId, "Patient");

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(200, result.StatusCode);

            var userData = result.Data as List<UserListDto>;
            Assert.NotNull(userData);
            Assert.Equal("Jane Patient", userData[0].Name);
            Assert.Equal("patient-profile.png", userData[0].Profile);
        }



        [Fact]
        public async Task SendMessageAsync_CreatesMessageWithoutAttachment()
        {
            // Arrange
            var senderId = "1";
            var receiverId = "2";
            var content = "Hello";
            var conversation = new Conversation { Id = 123, SenderId = senderId, ReceiverId = receiverId };

            _chatRepoMock.Setup(r => r.GetConversationByParticipantsAsync(senderId, receiverId))
                         .ReturnsAsync(conversation);

            _chatRepoMock.Setup(r => r.CreateMessageAsync(It.IsAny<Message>()))
                         .ReturnsAsync((Message m) => m);

            // Act
            var result = await _chatService.SendMessageAsync(senderId, receiverId, content, null);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(content, result.MessageContent);
            Assert.Equal(senderId, result.SenderId);
        }

        [Fact]
        public async Task SendMessageAsync_CreatesMessageWithAttachment()
        {
            // Arrange
            var senderId = "1";
            var receiverId = "2";
            var content = "Here's a file";
            var base64 = "data:image/png;base64," + Convert.ToBase64String(new byte[] { 1, 2, 3 });

            var conversation = new Conversation { Id = 123, SenderId = senderId, ReceiverId = receiverId };

            _chatRepoMock.Setup(r => r.GetConversationByParticipantsAsync(senderId, receiverId))
                         .ReturnsAsync(conversation);

            _chatRepoMock.Setup(r => r.CreateMessageAsync(It.IsAny<Message>()))
                         .ReturnsAsync((Message m) => m);

            _chatRepoMock.Setup(r => r.CreateAttachmentAsync(It.IsAny<Attachment>()))
                         .Returns(Task.CompletedTask); // okay since this returns Task

            // Act
            var result = await _chatService.SendMessageAsync(senderId, receiverId, content, base64);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(content, result.MessageContent);
        }
    }
}
