using HealthCareApplication.Contracts.Email;
using HealthCareApplication.Contracts.IService;
using HealthCareApplication.Dtos.UserDto;
using HealthCareApplication.Features.Services;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Patients;
using HealthCareDomain.Entity.UserEntity;
using HealthCareDomain.IServices;
using HealthCareInfrastructure.DataSecurity;
using HealthCarePersistence.IRepository;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Moq;
using System;
using System.Threading.Tasks;
using Xunit;

namespace HealthCareApplication.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly Mock<IPatientRepository> _mockPatientRepo;
        private readonly Mock<IDoctorRepository> _mockDoctorRepo;
        private readonly Mock<IMailService> _mockMailService;
        private readonly Mock<IOtpService> _mockOtpService;
        private readonly Mock<IFileService> _mockFileService;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            // Mock UserManager
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
            _mockUserManager = new Mock<UserManager<ApplicationUser>>(
                userStoreMock.Object,
                null, null, null, null, null, null, null, null);

            // Mock other dependencies
            _mockPatientRepo = new Mock<IPatientRepository>();
            _mockDoctorRepo = new Mock<IDoctorRepository>();
            _mockMailService = new Mock<IMailService>();
            _mockOtpService = new Mock<IOtpService>();
            _mockFileService = new Mock<IFileService>();

            // Mock data protection
            var mockDataProtector = new Mock<IDataProtector>();
            mockDataProtector
                .Setup(d => d.Protect(It.IsAny<byte[]>()))
                .Returns<byte[]>(data => data);

            var mockDataProtectionProvider = new Mock<IDataProtectionProvider>();
            mockDataProtectionProvider
                .Setup(d => d.CreateProtector(It.IsAny<string>()))
                .Returns(mockDataProtector.Object);

            var securityProvider = new DataSecurityProvider { securityKey = "test-secure-key-12345" };

            // Create AuthService with all mocked dependencies
            _authService = new AuthService(
                httpclient: null,
                _mockPatientRepo.Object,
                _mockDoctorRepo.Object,
                _mockUserManager.Object,
                signInManager: null,  // Add mock if needed for other tests
                _mockFileService.Object,
                _mockMailService.Object,
                _mockOtpService.Object,
                tokenService: null,   // Add mock if needed for other tests
                mockDataProtectionProvider.Object,
                securityProvider
            );
        }

        [Fact]
        public async Task AddUserAsync_NewPatient_ReturnsSuccess()
        {
            // Arrange
            var userDto = new UserDto
            {
                FullName = "John Doe",
                Email = "john@example.com",
                Password = "P@ssw0rd!",
                PhoneNumber = "1234567890"
            };

            var patientDto = new PatientDto
            {
                DateOfBirth = DateOnly.FromDateTime(DateTime.Now.AddYears(-30)),
                Address = "123 Main St",
                Gender = "Male"
            };

            _mockUserManager.Setup(x => x.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((ApplicationUser)null);

            _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);

            var result = await _authService.AddUserAsync(userDto, "Patient", patientDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(201, result.StatusCode);
            _mockPatientRepo.Verify(x => x.AddPatient(It.IsAny<Patient>()), Times.Once);

            // Corrected verification line
            _mockOtpService.Verify(
                x => x.StoreOtpAsync(It.IsAny<string>(), "Registration", It.IsAny<string>()),
                Times.Once
            );
        }

        [Fact]
        public async Task AddUserAsync_DuplicateEmail_ReturnsError()
        {
            // Arrange
            var userDto = new UserDto { Email = "aayushadhikari601@gmail.com" };
            var existingUser = new ApplicationUser { Email = userDto.Email };

            _mockUserManager.Setup(x => x.FindByEmailAsync(userDto.Email))
                .ReturnsAsync(existingUser);

            // Act
            var result = await _authService.AddUserAsync(userDto, "Patient", new PatientDto());

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(400, result.StatusCode);
            Assert.Contains("already exists", result.Message);
        }
    }
}