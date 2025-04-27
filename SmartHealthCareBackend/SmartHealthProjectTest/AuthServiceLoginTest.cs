using HealthCareApplication.Contracts.Email;
using HealthCareApplication.Contracts.IService;
using HealthCareApplication.Dtos.UserDto;
using HealthCareApplication.Features.Services;
using HealthCareDomain.Entity.UserEntity;
using HealthCareDomain.IServices;
using HealthCareInfrastructure.DataSecurity;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace SmartHealthProjectTest
{
    public class AuthServiceLoginTests
    {
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly Mock<IMailService> _mockMailService;
        private readonly Mock<IOtpService> _mockOtpService;
        private readonly Mock<ITokenService> _mockTokenService;
        private readonly AuthService _authService;
        private readonly FakeDataProtector _fakeDataProtector;

        public AuthServiceLoginTests()
        {
            // Setup UserManager with a mock IUserStore.
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
            _mockUserManager = new Mock<UserManager<ApplicationUser>>(
                userStoreMock.Object, null, null, null, null, null, null, null, null);

            // Setup other dependency mocks.
            _mockMailService = new Mock<IMailService>();
            _mockOtpService = new Mock<IOtpService>();
            _mockTokenService = new Mock<ITokenService>();

            // Create a fake data protector instance.
            _fakeDataProtector = new FakeDataProtector();

            // Setup an IDataProtectionProvider that returns our fake protector.
            var mockDataProtectionProvider = new Mock<IDataProtectionProvider>();
            mockDataProtectionProvider
                .Setup(dp => dp.CreateProtector(It.IsAny<string>()))
                .Returns(_fakeDataProtector);

            // Create a security provider with a test security key.
            var securityProvider = new DataSecurityProvider { securityKey = "test-secure-key-12345" };

            // Instantiate AuthService with the mocked dependencies.
            _authService = new AuthService(
                httpclient: null,
                patientRepository: null,  // Not needed for login tests.
                doctorRepository: null,   // Not needed for login tests.
                userManager: _mockUserManager.Object,
                signInManager: null,      // Not used in this login method.
                fileService: null,        // Not used in this login method.
                mailService: _mockMailService.Object,
                otpService: _mockOtpService.Object,
                tokenService: _mockTokenService.Object,
                dataProtector: mockDataProtectionProvider.Object,
                securityProvider: securityProvider
            );
        }

        [Fact]
        public async Task LoginUserAsync_UserNotRegistered_ReturnsNotFound()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "notregistered@example.com",
                Password = "anyPassword"
            };

            // Setup: user does not exist.
            _mockUserManager.Setup(x => x.FindByEmailAsync(loginDto.Email))
                .ReturnsAsync((ApplicationUser)null);

            // Act
            var result = await _authService.LoginUserAsync(loginDto);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(404, result.StatusCode);
            Assert.Contains("not registered", result.Message, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task LoginUserAsync_IncorrectPassword_ReturnsNotFound()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "user@example.com",
                Password = "wrongPassword"
            };

            var existingUser = new ApplicationUser
            {
                Id = "user123",
                Email = loginDto.Email,
                FullName = "Test User",
                IsBlocked = false,
                EmailConfirmed = true
            };

            _mockUserManager.Setup(x => x.FindByEmailAsync(loginDto.Email))
                .ReturnsAsync(existingUser);

            // Setup: CheckPasswordAsync returns false.
            _mockUserManager.Setup(x => x.CheckPasswordAsync(existingUser, loginDto.Password))
                .ReturnsAsync(false);

            // Act
            var result = await _authService.LoginUserAsync(loginDto);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(404, result.StatusCode);
            Assert.Contains("incorrect", result.Message, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task LoginUserAsync_BlockedUser_ReturnsForbidden()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "blocked@example.com",
                Password = "anyPassword"
            };

            var blockedUser = new ApplicationUser
            {
                Id = "blocked123",
                Email = loginDto.Email,
                FullName = "Blocked User",
                IsBlocked = true,
                EmailConfirmed = true
            };

            _mockUserManager.Setup(x => x.FindByEmailAsync(loginDto.Email))
                .ReturnsAsync(blockedUser);

            // Setup password check to succeed.
            _mockUserManager.Setup(x => x.CheckPasswordAsync(blockedUser, loginDto.Password))
                .ReturnsAsync(true);

            // Setup to return a role (role value is not important if user is blocked)
            _mockUserManager.Setup(x => x.GetRolesAsync(blockedUser))
                .ReturnsAsync(new List<string> { "Patient" });

            // Act
            var result = await _authService.LoginUserAsync(loginDto);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(403, result.StatusCode);
            Assert.Contains("banned", result.Message, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task LoginUserAsync_EmailNotConfirmedForPatient_ReturnsUnauthorizedWithOtp()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "unconfirmed@example.com",
                Password = "correctPassword"
            };

            var unconfirmedPatient = new ApplicationUser
            {
                Id = "patient123",
                Email = loginDto.Email,
                FullName = "Patient Unconfirmed",
                IsBlocked = false,
                EmailConfirmed = false
            };

            _mockUserManager.Setup(x => x.FindByEmailAsync(loginDto.Email))
                .ReturnsAsync(unconfirmedPatient);

            _mockUserManager.Setup(x => x.CheckPasswordAsync(unconfirmedPatient, loginDto.Password))
                .ReturnsAsync(true);

            // Setup patient role.
            _mockUserManager.Setup(x => x.GetRolesAsync(unconfirmedPatient))
                .ReturnsAsync(new List<string> { "Patient" });

            // Act
            var result = await _authService.LoginUserAsync(loginDto);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(401, result.StatusCode);

            // Instead of expecting literal "patient123", compare with the output from our fake protector.
            var expectedProtected = _fakeDataProtector.Protect(unconfirmedPatient.Id);
            Assert.Equal(expectedProtected, result.Message);

            // Additionally, verify that OTP and email are triggered.
            _mockOtpService.Verify(x => x.StoreOtpAsync(unconfirmedPatient.Id, "Registration", It.IsAny<string>()), Times.Once);
            _mockMailService.Verify(x => x.SendEmail(unconfirmedPatient.Email, unconfirmedPatient.FullName, It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public async Task LoginUserAsync_EmailNotConfirmedForDoctor_ReturnsNotFoundWithVerificationMessage()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "docunconfirmed@example.com",
                Password = "correctPassword"
            };

            var unconfirmedDoctor = new ApplicationUser
            {
                Id = "doctor123",
                Email = loginDto.Email,
                FullName = "Doctor Unconfirmed",
                IsBlocked = false,
                EmailConfirmed = false
            };

            _mockUserManager.Setup(x => x.FindByEmailAsync(loginDto.Email))
                .ReturnsAsync(unconfirmedDoctor);

            _mockUserManager.Setup(x => x.CheckPasswordAsync(unconfirmedDoctor, loginDto.Password))
                .ReturnsAsync(true);

            // Setup doctor role.
            _mockUserManager.Setup(x => x.GetRolesAsync(unconfirmedDoctor))
                .ReturnsAsync(new List<string> { "Doctor" });

            // Act
            var result = await _authService.LoginUserAsync(loginDto);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(404, result.StatusCode);
            Assert.Contains("verification", result.Message, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task LoginUserAsync_SuccessfulLogin_ReturnsToken()
        {
            // Arrange
            var loginDto = new LoginDto
            {
                Email = "success@example.com",
                Password = "correctPassword"
            };

            var confirmedUser = new ApplicationUser
            {
                Id = "userSuccess",
                Email = loginDto.Email,
                FullName = "Successful User",
                IsBlocked = false,
                EmailConfirmed = true
            };

            _mockUserManager.Setup(x => x.FindByEmailAsync(loginDto.Email))
                .ReturnsAsync(confirmedUser);

            _mockUserManager.Setup(x => x.CheckPasswordAsync(confirmedUser, loginDto.Password))
                .ReturnsAsync(true);

            // Assume the user has a role.
            var roles = new List<string> { "Patient" };
            _mockUserManager.Setup(x => x.GetRolesAsync(confirmedUser))
                .ReturnsAsync(roles);

            // Setup the token service to return a dummy token.
            var dummyToken = "dummy.jwt.token";
            _mockTokenService.Setup(x => x.GenerateToken(confirmedUser, roles))
                .Returns(dummyToken);

            // Act
            var result = await _authService.LoginUserAsync(loginDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal("Login successful", result.Message);
            Assert.Equal(dummyToken, result.Data);
        }
    }


    // Fake data protector implementation for testing purposes.
    public class FakeDataProtectorForLoginTests : IDataProtector
    {
        public IDataProtector CreateProtector(string purpose)
        {
            return this;
        }

        // For testing purposes, simply return the input as a byte array for Protect,
        // and vice versa for Unprotect. In this simple Fake, we also implement Protect(string).
        public byte[] Protect(byte[] userData)
        {
            return userData;
        }

        public byte[] Unprotect(byte[] protectedData)
        {
            return protectedData;
        }

        // Optional: a helper method to mimic string protection.
        public string Protect(string input)
        {
            // In our Fake, simply return the input unchanged.
            return input;
        }
    }

    
}
