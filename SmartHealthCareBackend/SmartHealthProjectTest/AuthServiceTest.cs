using HealthCareApplication.Contracts.Email;
using HealthCareApplication.Contracts.IService;
using HealthCareApplication.Dtos.UserDto;
using HealthCareApplication.Features.Services;
using HealthCareDomain.Entity.Patients;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.UserEntity;
using HealthCareDomain.IServices;
using HealthCareInfrastructure.DataSecurity;
using HealthCarePersistence.IRepository;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Moq;
using System;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace SmartHealthProjectTest
{
    public class AuthServiceTests
    {
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly Mock<IPatientRepository> _mockPatientRepo;
        private readonly Mock<IDoctorRepository> _mockDoctorRepo;
        private readonly Mock<IMailService> _mockMailService;
        private readonly Mock<IOtpService> _mockOtpService;
        private readonly Mock<IFileService> _mockFileService;
        private readonly Mock<ITokenService> _mockTokenService;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            // Setup UserManager using a mock IUserStore
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
            _mockUserManager = new Mock<UserManager<ApplicationUser>>(
                userStoreMock.Object,
                null, null, null, null, null, null, null, null);

            // Setup other dependency mocks
            _mockPatientRepo = new Mock<IPatientRepository>();
            _mockDoctorRepo = new Mock<IDoctorRepository>();
            _mockMailService = new Mock<IMailService>();
            _mockOtpService = new Mock<IOtpService>();
            _mockFileService = new Mock<IFileService>();
            _mockTokenService = new Mock<ITokenService>();

            // Instead of using Moq for IDataProtector (which fails because of extension methods),
            // create a fake implementation that simply returns the provided string.
            var fakeDataProtector = new FakeDataProtector();

            // Setup an IDataProtectionProvider that returns our fake protector.
            var mockDataProtectionProvider = new Mock<IDataProtectionProvider>();
            mockDataProtectionProvider
                .Setup(dp => dp.CreateProtector(It.IsAny<string>()))
                .Returns(fakeDataProtector);

            // Create a security provider with a test security key
            var securityProvider = new DataSecurityProvider { securityKey = "test-secure-key-12345" };

            // Create AuthService with all mocked dependencies.
            // Note: HttpClient, SignInManager, and ITokenService are set to null or mocked as needed.
            _authService = new AuthService(
                httpclient: null,
                patientRepository: _mockPatientRepo.Object,
                doctorRepository: _mockDoctorRepo.Object,
                userManager: _mockUserManager.Object,
                signInManager: null, // Not used in these tests.
                fileService: _mockFileService.Object,
                mailService: _mockMailService.Object,
                otpService: _mockOtpService.Object,
                tokenService: _mockTokenService.Object,
                dataProtector: mockDataProtectionProvider.Object,
                securityProvider: securityProvider
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

            // Setup UserManager to simulate that the email does not exist.
            _mockUserManager.Setup(x => x.FindByEmailAsync(userDto.Email))
                .ReturnsAsync((ApplicationUser)null);
            _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);
            _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), "Patient"))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _authService.AddUserAsync(userDto, "Patient", patientDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(201, result.StatusCode);
            _mockPatientRepo.Verify(x => x.AddPatient(It.IsAny<Patient>()), Times.Once);
            _mockOtpService.Verify(x => x.StoreOtpAsync(It.IsAny<string>(), "Registration", It.IsAny<string>()), Times.Once);
            _mockMailService.Verify(x => x.SendEmail(userDto.Email, userDto.FullName, It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public async Task AddUserAsync_DuplicateEmail_ReturnsError()
        {
            // Arrange
            var userDto = new UserDto
            {
                FullName = "Existing User",
                Email = "existing@example.com",
                Password = "P@ssw0rd!",
                PhoneNumber = "1234567890"
            };

            var patientDto = new PatientDto
            {
                DateOfBirth = DateOnly.FromDateTime(DateTime.Now.AddYears(-30)),
                Address = "123 Main St",
                Gender = "Male"
            };

            // Setup UserManager to simulate that the email already exists.
            var existingUser = new ApplicationUser
            {
                Email = userDto.Email,
                FullName = "Existing User"
            };

            _mockUserManager.Setup(x => x.FindByEmailAsync(userDto.Email))
                .ReturnsAsync(existingUser);

            // Act
            var result = await _authService.AddUserAsync(userDto, "Patient", patientDto);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(400, result.StatusCode);
            Assert.Contains("already exists", result.Message);
            _mockUserManager.Verify(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()), Times.Never);
            _mockPatientRepo.Verify(x => x.AddPatient(It.IsAny<Patient>()), Times.Never);
        }

        [Fact]
        public async Task AddUserAsync_NewDoctor_ReturnsVerificationMessage()
        {
            // Arrange
            var userDto = new UserDto
            {
                FullName = "Dr. Smith",
                Email = "drsmith@example.com",
                Password = "P@ssw0rd!",
                PhoneNumber = "9876543210"
            };

            // Fake DoctorDto for doctor registration with required file properties.
            var doctorDto = new DoctorDto
            {
                LicenseNumber = "LIC12345",
                Specialization = "Cardiology",
                Qualifications = "MBBS, MD",
                Location = "City Hospital",
                LicenseFile = new FakeFormFile("license.pdf"),
                GovernmentIdFile = new FakeFormFile("govId.pdf"),
                QualificationsFile = new FakeFormFile("qualifications.pdf")
            };

            // Setup mocks so that the user does not exist and creation is successful.
            _mockUserManager.Setup(x => x.FindByEmailAsync(userDto.Email))
                .ReturnsAsync((ApplicationUser)null);
            _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);
            _mockUserManager.Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), "Doctor"))
                .ReturnsAsync(IdentityResult.Success);

            // Setup file service mocks to return file paths.
            _mockFileService.Setup(x => x.SaveFileAsync(doctorDto.LicenseFile, "Liscense"))
                .ReturnsAsync("path/to/license.pdf");
            _mockFileService.Setup(x => x.SaveFileAsync(doctorDto.GovernmentIdFile, "Government"))
                .ReturnsAsync("path/to/govId.pdf");
            _mockFileService.Setup(x => x.SaveFileAsync(doctorDto.QualificationsFile, "Qualification"))
                .ReturnsAsync("path/to/qualification.pdf");

            // Act
            var result = await _authService.AddUserAsync(userDto, "Doctor", doctorDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(200, result.StatusCode);
            _mockDoctorRepo.Verify(x => x.AddDoctor(It.IsAny<Doctor>()), Times.Once);
        }

        [Fact]
        public async Task AddUserAsync_UserCreationFails_ReturnsError()
        {
            // Arrange
            var userDto = new UserDto
            {
                FullName = "New User",
                Email = "newuser@example.com",
                Password = "P@ssw0rd!",
                PhoneNumber = "1231231234"
            };

            var patientDto = new PatientDto
            {
                DateOfBirth = DateOnly.FromDateTime(DateTime.Now.AddYears(-25)),
                Address = "456 Elm St",
                Gender = "Female"
            };

            // Setup mocks to simulate failure during user creation.
            _mockUserManager.Setup(x => x.FindByEmailAsync(userDto.Email))
                .ReturnsAsync((ApplicationUser)null);
            _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Creation failed." }));

            // Act
            var result = await _authService.AddUserAsync(userDto, "Patient", patientDto);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(500, result.StatusCode);
            Assert.Contains("Failed to create user", result.Message);
        }
    }

    // A simple fake implementation of IDataProtector that bypasses any real protection.
    public class FakeDataProtector : IDataProtector
    {
        public IDataProtector CreateProtector(string purpose)
        {
            return this;
        }

        // Since the extension method calls are not virtual, we implement the underlying 
        // byte[] methods. These are what the extension methods will use.
        public byte[] Protect(byte[] userData)
        {
            return userData;
        }

        public byte[] Unprotect(byte[] protectedData)
        {
            return protectedData;
        }
    }

    // A simple fake implementation of IFormFile for testing purposes.
    public class FakeFormFile : IFormFile
    {
        private readonly string _fileName;
        public FakeFormFile(string fileName)
        {
            _fileName = fileName;
        }

        public string ContentType => "application/pdf";

        public string ContentDisposition => throw new NotImplementedException();

        public IHeaderDictionary Headers => throw new NotImplementedException();

        public long Length => 1024;

        public string Name => "file";

        public string FileName => _fileName;

        public void CopyTo(Stream target)
        {
            using (var stream = OpenReadStream())
            {
                stream.CopyTo(target);
            }
        }

        public async Task CopyToAsync(Stream target, CancellationToken cancellationToken = default)
        {
            using (var stream = OpenReadStream())
            {
                await stream.CopyToAsync(target, cancellationToken);
            }
        }

        public Stream OpenReadStream()
        {
            return new MemoryStream(Encoding.UTF8.GetBytes("Dummy file content"));
        }
    }
}
