using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HealthCareApplication.Dtos.AvailabilityDto;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.IRepository;
using HealthCarePersistence.IRepository;
using HealthCareInfrastructure.DataSecurity;
using HealthCareApplication.Features.Services;
using HealthCareApplication.Dtos.UserDto;
using Xunit;
using Microsoft.AspNetCore.DataProtection;
using System.Text;

namespace HealthCareApplication.Tests.Services
{
    public class DoctorAvailabilityServiceTests
    {
        private readonly Mock<IDoctorAvailabilityRepository> _mockDoctorAvailabilityRepository;
        private readonly Mock<IDoctorRepository> _mockDoctorRepository;
        private readonly Mock<IDataProtectionProvider> _mockDataProtectionProvider;
        private readonly DataSecurityProvider _securityProvider;
       
        private readonly DoctorAvailabilityService _service;

        public DoctorAvailabilityServiceTests()
        {
            _mockDoctorAvailabilityRepository = new Mock<IDoctorAvailabilityRepository>();
            _mockDoctorRepository = new Mock<IDoctorRepository>();
            _mockDataProtectionProvider = new Mock<IDataProtectionProvider>();

            // Create a real security provider with a test key
            _securityProvider = new DataSecurityProvider { securityKey = "test-secure-key-12345" };

            // Initializing the service with mocked dependencies
            _service = new DoctorAvailabilityService(
                _mockDoctorAvailabilityRepository.Object,
                _mockDoctorRepository.Object,
                _mockDataProtectionProvider.Object,
                _securityProvider
            );
        }

        [Fact]
        public async Task GenerateSlotsAsync_DoctorDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            var doctorAvailabilityDto = new DoctorAvailabilityDto
            {
                DoctorId = "valid-doctor-id",
                TimeSlots = new List<TimeSlot>
                {
                    new TimeSlot { StartTime = "09:00", EndTime = "12:00", SlotDuration = 30, Date = "2025-04-21" }
                }
            };

            _mockDoctorRepository.Setup(r => r.GetDoctorBYId(It.IsAny<string>())).ReturnsAsync((Doctor)null);

            // Act
            var result = await _service.GenerateSlotsAsync(doctorAvailabilityDto);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Doctor does not exist", result.Message);
        }

        [Fact]
        public async Task GenerateSlotsAsync_SuccessfulSlotGeneration_ReturnsCreated()
        {
            // Arrange
            var doctorAvailabilityDto = new DoctorAvailabilityDto
            {
                DoctorId = "valid-doctor-id",
                TimeSlots = new List<TimeSlot>
                {
                    new TimeSlot { StartTime = "09:00", EndTime = "12:00", SlotDuration = 30, Date = "2025-04-21" }
                }
            };

            var doctor = new Doctor { Id = "valid-doctor-id" };
            _mockDoctorRepository.Setup(r => r.GetDoctorBYId(It.IsAny<string>())).ReturnsAsync(doctor);
            _mockDoctorAvailabilityRepository.Setup(r => r.SaveSlotsAsync(It.IsAny<List<DoctorAvailability>>()))
                                              .Returns(Task.CompletedTask);

            // Act
            var result = await _service.GenerateSlotsAsync(doctorAvailabilityDto);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(201, result.StatusCode);
            Assert.Equal("Slots generated and saved successfully", result.Message);
        }

  

        [Fact]
        public async Task GetAvailabilityAsync_DoctorNotFound_ThrowsException()
        {
            // Arrange
            _mockDoctorAvailabilityRepository.Setup(r => r.GetSlotsAsync(It.IsAny<string>())).ThrowsAsync(new Exception("Error"));

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.GetAvailabilityAsync("user1"));
            Assert.Equal("An error occurred while fetching doctor availability details.", exception.Message);
        }
    }

}