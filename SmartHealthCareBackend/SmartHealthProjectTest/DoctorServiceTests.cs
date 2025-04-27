// File: DoctorServiceTests.cs
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HealthCareApplication.Dtos.CommentDto;
using HealthCareApplication.Features.Services;
using HealthCareApplication.NotificationHub;
using HealthCareDomain.Entity.Review;
using HealthCareDomain.Entity.UserEntity;
using HealthCarePersistence.IRepository;
using HealthCareInfrastructure.DataSecurity;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Moq;
using Xunit;
using HealthCareApplication.Contracts.IService;
using HealthCareDomain.Entity.Doctors;

namespace SmartHealthProjectTest
{
    public class DoctorServiceTests
    {
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly Mock<IDoctorRepository> _mockDoctorRepo;
        private readonly Mock<IFileService> _mockFileService;
        private readonly Mock<IHubContext<Notificationhub>> _mockHubContext;
        private readonly IDataProtectionProvider _dataProtectionProvider;
        private readonly TestFakeDataProtector _fakeProtector;
        private readonly Mock<IClientProxy> _mockClientProxy;
        private readonly DoctorService _service;

        public DoctorServiceTests()
        {
            // 1) UserManager
            var userStore = new Mock<IUserStore<ApplicationUser>>();
            _mockUserManager = new Mock<UserManager<ApplicationUser>>(
                userStore.Object, null, null, null, null, null, null, null, null
            );

            // 2) Repository & FileService
            _mockDoctorRepo = new Mock<IDoctorRepository>();
            _mockFileService = new Mock<IFileService>();

            // 3) SignalR context
            _mockHubContext = new Mock<IHubContext<Notificationhub>>();
            var clients = new Mock<IHubClients>();
            _mockClientProxy = new Mock<IClientProxy>();
            clients.Setup(c => c.All).Returns(_mockClientProxy.Object);
            _mockHubContext.Setup(h => h.Clients).Returns(clients.Object);

            // 4) Fake IDataProtector
            _fakeProtector = new TestFakeDataProtector();
            var providerMock = new Mock<IDataProtectionProvider>();
            providerMock
                .Setup(p => p.CreateProtector(It.IsAny<string>()))
                .Returns(_fakeProtector);
            _dataProtectionProvider = providerMock.Object;

            // 5) Service under test
            _service = new DoctorService(
                _mockUserManager.Object,
                _mockHubContext.Object,
                _mockDoctorRepo.Object,
                _dataProtectionProvider,
                new DataSecurityProvider(),  // or mock if desired
                _mockFileService.Object
            );
        }

        [Fact]
        public async Task DoCommentAsync_ValidComment_ReturnsSuccess()
        {
            var encryptedId = _fakeProtector.Protect("DecryptedDoctorId");
            var dto = new CommentDtoo
            {
                DoctorId = encryptedId,
                PatientId = "patient123",
                UserName = "John Doe",
                VisitedFor = "Checkup",
                IsRecommended = true,
                ReviewText = "Excellent care!"
            };

            var result = await _service.DoCommentAsync(dto);

            Assert.True(result.IsSuccess);
            Assert.Equal(200, result.StatusCode);
            _mockDoctorRepo.Verify(r => r.AddComment(It.IsAny<Comments>()), Times.Once);
            _mockClientProxy.Verify(c =>
                c.SendCoreAsync("ReceiveNotification", It.IsAny<object[]>(), default),
                Times.Once
            );
        }

        [Fact]
        public async Task DoReplyAsync_ValidReply_ReturnsSuccess()
        {
            var encryptedId = _fakeProtector.Protect("DecryptedDoctorId");
            var dto = new ReplyDto
            {
                DoctorId = encryptedId,
                CommentId = 42,
                ReplyText = "Thank you!"
            };

            var result = await _service.DoReplyAsync(dto);

            Assert.True(result.IsSuccess);
            Assert.Equal(200, result.StatusCode);
            _mockDoctorRepo.Verify(r => r.AddReply(It.IsAny<Reply>()), Times.Once);
        }

        [Fact]
        public async Task GetCommentsAsync_InvalidDoctorId_ReturnsBadRequest()
        {
            // Non‐Base64 input => framework extension Unprotect throws
            var result = await _service.GetCommentsAsync("not-base64");
            Assert.False(result.IsSuccess);
            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async Task GetCommentsAsync_ValidDoctorIdWithComments_ReturnsComments()
        {
            var encryptedId = _fakeProtector.Protect("DecryptedDoctorId");
            var comments = new List<Comments>
            {
                new Comments
                {
                    Id            = 1,
                    UserName      = "Jane",
                    ReviewText    = "Great!",
                    VisitedFor    = "Flu",
                    IsRecommended = true,
                    CreatedAt     = new DateTime(2025, 4, 21, 7, 28, 1, DateTimeKind.Utc)
                }
            };
            _mockDoctorRepo
                .Setup(r => r.GetCommentsAsync("DecryptedDoctorId"))
                .ReturnsAsync(comments);

            var result = await _service.GetCommentsAsync(encryptedId);

            Assert.True(result.IsSuccess);
            var dtos = Assert.IsType<List<GetCommentsDto>>(result.Data);
            Assert.Collection(dtos,
                dto =>
                {
                    Assert.Equal(1, dto.CommentId);
                    Assert.Equal("Jane", dto.UserName);
                    Assert.Equal("Great!", dto.ReviewText);
                    Assert.True(dto.IsRecommended);
                    Assert.Equal(new DateTime(2025, 4, 21, 7, 28, 1, DateTimeKind.Utc), dto.CreatedAt);
                    Assert.Equal("Flu", dto.VisitedFor);
                }
            );
        }

        [Fact]
        public async Task GetDoctorDetails_ValidEncryptedId_ReturnsDoctor()
        {
            var encryptedId = _fakeProtector.Protect("DecryptedDoctorId");
            var doctor = new Doctor
            {
                Id = "DecryptedDoctorId",
                Specialization = "Cardiology",
                Qualifications = "MD",
                Location = "LA",
                Description = "Experienced",
                Profile = "profile.jpg",
                Fee = "150",
                Experience = "10 years",
                FromDay = "Mon",
                FromTime = "9:00 AM",
                ToDay = "Fri",
                ToTime = "5:00 PM",
                GovernmentIdFilePath = "gov.pdf",
                QualificationsFilePath = "qual.pdf",
                LicenseFilePath = "lic.pdf",
                User = new ApplicationUser
                {
                    FullName = "Dr. Who",
                    Email = "who@example.com",
                    PhoneNumber = "555-1234"
                }
            };
            _mockDoctorRepo
                .Setup(r => r.GetDoctorBYId("DecryptedDoctorId"))
                .ReturnsAsync(doctor);
            _mockDoctorRepo
                .Setup(r => r.GetByUserIdFromAdditionalAsync("DecryptedDoctorId"))
                .ReturnsAsync(new List<DoctorAdditionalInfo>
                {
                    new DoctorAdditionalInfo { ExperienceDetail = "Mayo Clinic", Trainings = "Cardiac Care" }
                });

            var result = await _service.GetDoctorDetails(encryptedId);

            Assert.True(result.IsSuccess);
            Assert.Equal(200, result.StatusCode);
          
        }
    }

    // Avoid duplicate FakeDataProtector definitions
    public class TestFakeDataProtector : IDataProtector
    {
        public IDataProtector CreateProtector(string purpose) => this;
        public byte[] Protect(byte[] userData) => userData;
        public byte[] Unprotect(byte[] protectedData) => protectedData;
    }
}
