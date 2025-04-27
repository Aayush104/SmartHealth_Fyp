using System;
using System.Threading.Tasks;
using Xunit;
using Moq;
using Microsoft.AspNetCore.Identity;
using HealthCareDomain.Entity.UserEntity;
using HealthCareDomain.Entity.Patients;
using HealthCareApplication.Contracts.IService;
using HealthCarePersistence.IRepository;
using HealthCareApplication.Features.Services;
using HealthCareApplication.Dtos.UserDto;
using HealthCareApplication.Dtos.UserDtoo;

namespace SmartHealthProjectTest
{
    public class PatientServiceTests
    {
        private readonly Mock<IPatientRepository> _mockPatientRepo;
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly PatientService _patientService;

        public PatientServiceTests()
        {
            _mockPatientRepo = new Mock<IPatientRepository>();
            var store = new Mock<IUserStore<ApplicationUser>>();
            _mockUserManager = new Mock<UserManager<ApplicationUser>>(store.Object, null, null, null, null, null, null, null, null);

            _patientService = new PatientService(_mockPatientRepo.Object, _mockUserManager.Object);
        }

        [Fact]
        public async Task AddPatientDetailsAsync_UserNotFound_ReturnsBadRequest()
        {
            // Arrange
            _mockUserManager.Setup(x => x.FindByIdAsync(It.IsAny<string>()))
                            .ReturnsAsync((ApplicationUser)null);

            var dto = new AddPatientDetailsDto { phoneNumber = "1234567890", Gender = "Male", Address = "Some address" };

            // Act
            var result = await _patientService.AddPatientDetailsAsync(dto, "invalidUserId");

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("User not found", result.Message);
        }

        [Fact]
        public async Task AddPatientDetailsAsync_UpdateUserFailed_ReturnsServerError()
        {
            var user = new ApplicationUser();
            _mockUserManager.Setup(x => x.FindByIdAsync(It.IsAny<string>())).ReturnsAsync(user);
            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<ApplicationUser>()))
                            .ReturnsAsync(IdentityResult.Failed());

            var dto = new AddPatientDetailsDto { phoneNumber = "1234567890", Gender = "Female", Address = "Address" };

            var result = await _patientService.AddPatientDetailsAsync(dto, "userId");

            Assert.False(result.IsSuccess);
            Assert.Equal(500, result.StatusCode);
            Assert.Equal("Failed to update user details", result.Message);
        }

        [Fact]
        public async Task AddPatientDetailsAsync_RepositoryUpdateFails_ReturnsServerError()
        {
            var user = new ApplicationUser();
            _mockUserManager.Setup(x => x.FindByIdAsync(It.IsAny<string>())).ReturnsAsync(user);
            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<ApplicationUser>()))
                            .ReturnsAsync(IdentityResult.Success);
            _mockPatientRepo.Setup(x => x.UpdatePatientDetailsAsync(It.IsAny<Patient>(), It.IsAny<string>()))
                            .ReturnsAsync((Patient)null);

            var dto = new AddPatientDetailsDto { phoneNumber = "9876543210", Gender = "Other", Address = "New Address" };

            var result = await _patientService.AddPatientDetailsAsync(dto, "userId");

            Assert.False(result.IsSuccess);
            Assert.Equal(500, result.StatusCode);
            Assert.Equal("Failed to update patient details in the repository", result.Message);
        }

        [Fact]
        public async Task AddPatientDetailsAsync_Success_ReturnsSuccess()
        {
            var user = new ApplicationUser();
            _mockUserManager.Setup(x => x.FindByIdAsync(It.IsAny<string>())).ReturnsAsync(user);
            _mockUserManager.Setup(x => x.UpdateAsync(It.IsAny<ApplicationUser>()))
                            .ReturnsAsync(IdentityResult.Success);
            _mockPatientRepo.Setup(x => x.UpdatePatientDetailsAsync(It.IsAny<Patient>(), It.IsAny<string>()))
                            .ReturnsAsync(new Patient());

            var dto = new AddPatientDetailsDto { phoneNumber = "9876543210", Gender = "Male", Address = "Main Street" };

            var result = await _patientService.AddPatientDetailsAsync(dto, "userId");

            Assert.True(result.IsSuccess);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal("Patient details updated successfully", result.Message);
        }

        [Fact]
        public async Task GetPatientDetailsAsync_UserIdIsNull_ReturnsBadRequest()
        {
            var result = await _patientService.GetPatientDetailsAsync(null);

            Assert.False(result.IsSuccess);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("User ID is required.", result.Message);
        }

        [Fact]
        public async Task GetPatientDetailsAsync_PatientNotFound_ReturnsNotFound()
        {
            _mockPatientRepo.Setup(x => x.GetPatientDetailAsync(It.IsAny<string>()))
                            .ReturnsAsync((Patient)null);

            var result = await _patientService.GetPatientDetailsAsync("userId");

            Assert.False(result.IsSuccess);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("No patient found with the provided User ID.", result.Message);
        }

        [Fact]
        public async Task GetPatientDetailsAsync_Success_ReturnsPatient()
        {
            _mockPatientRepo.Setup(x => x.GetPatientDetailAsync(It.IsAny<string>()))
                            .ReturnsAsync(new Patient());

            var result = await _patientService.GetPatientDetailsAsync("userId");

            Assert.True(result.IsSuccess);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal("Patient details retrieved successfully.", result.Message);
        }

        [Fact]
        public async Task GetPatientDetailsAsync_ExceptionThrown_ReturnsServerError()
        {
            _mockPatientRepo.Setup(x => x.GetPatientDetailAsync(It.IsAny<string>()))
                            .ThrowsAsync(new Exception("Database error"));

            var result = await _patientService.GetPatientDetailsAsync("userId");

            Assert.False(result.IsSuccess);
            Assert.Equal(500, result.StatusCode);
            Assert.Equal("An error occurred while fetching patient details.", result.Message);
        }
    }
}
