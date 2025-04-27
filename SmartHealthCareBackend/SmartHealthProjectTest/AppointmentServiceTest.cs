using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Moq;
using Xunit;
using HealthCareDomain.Entity.Appointment;
using HealthCareApplication.Contracts.IService;
using HealthCareDomain.IRepository;

using HealthCareApplication.Features.Services;
using HealthCareDomain.Entity.UserEntity;

using System.Text;
using HealthCareApplication.Contracts.Email;
using HealthCareApplication.Dtos.AvailabilityDto;
using HealthCareDomain.Entity.Doctors;
using HealthCareInfrastructure.DataSecurity;

namespace SmartHealthProjectTest
{
    public class AppointmentServiceTests
    {
        private readonly Mock<IBookAppointmentRepository> _mockBookRepo;
        private readonly Mock<IDoctorAvailabilityRepository> _mockDoctorAvailabilityRepo;
        private readonly Mock<IDataProtector> _mockDataProtector;
        private readonly Mock<IDataProtectionProvider> _mockDataProtectionProvider;
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly Mock<IMailService> _mockMailService;
        private readonly Mock<IFileService> _mockFileService;
        private readonly Mock<DataSecurityProvider> _mockDataSecurityProvider;

        private readonly AppointmentService _service;

        public AppointmentServiceTests()
        {
            _mockBookRepo = new Mock<IBookAppointmentRepository>();
            _mockDoctorAvailabilityRepo = new Mock<IDoctorAvailabilityRepository>();
            _mockDataProtector = new Mock<IDataProtector>();
            _mockDataProtectionProvider = new Mock<IDataProtectionProvider>();
            _mockMailService = new Mock<IMailService>();
            _mockFileService = new Mock<IFileService>();
            _mockDataSecurityProvider = new Mock<DataSecurityProvider>();

            var store = new Mock<IUserStore<ApplicationUser>>();
            _mockUserManager = new Mock<UserManager<ApplicationUser>>(store.Object, null, null, null, null, null, null, null, null);

            _mockDataProtectionProvider.Setup(x => x.CreateProtector(It.IsAny<string>()))
                .Returns(_mockDataProtector.Object);

            // Correctly setup Unprotect to handle byte array input
            _mockDataProtector.Setup(p => p.Unprotect(It.IsAny<byte[]>()))
                .Returns((byte[] input) => Encoding.UTF8.GetBytes("DecryptedDoctorId"));

            _service = new AppointmentService(
                _mockUserManager.Object,
                _mockBookRepo.Object,
                _mockDoctorAvailabilityRepo.Object,
                _mockDataSecurityProvider.Object,
                _mockDataProtectionProvider.Object,
                _mockMailService.Object,
                _mockFileService.Object
            );
        }

        [Fact]
        public async Task BookAppointmentAsync_NullAppointmentDto_ReturnsBadRequest()
        {
            var result = await _service.BookAppointmentAsync(null, "user1", 100, "UPI");

            Assert.False(result.IsSuccess);
            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async Task BookAppointmentAsync_InvalidUserId_ReturnsBadRequest()
        {
            var dto = new AppointmentDto { DoctorId = "EncryptedId" };

            var result = await _service.BookAppointmentAsync(dto, "", 100, "UPI");

            Assert.False(result.IsSuccess);
            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async Task BookAppointmentAsync_InvalidDoctorId_Throws_ReturnsBadRequest()
        {
            // Use a valid base64 string to trigger the Unprotect method
            var invalidDoctorId = Convert.ToBase64String(Encoding.UTF8.GetBytes("InvalidData"));
            var dto = new AppointmentDto { DoctorId = invalidDoctorId };

            _mockDataProtector.Setup(p => p.Unprotect(It.IsAny<byte[]>()))
                .Throws(new Exception("Decrypt failed"));

            var result = await _service.BookAppointmentAsync(dto, "user1", 100, "UPI");

            Assert.False(result.IsSuccess);
            Assert.Equal(400, result.StatusCode);
            Assert.Contains("Invalid doctor ID", result.Message);
        }

        [Fact]
        public async Task BookAppointmentAsync_FailedToSaveAppointment_ReturnsBadRequest()
        {
            var dto = new AppointmentDto
            {
                DoctorId = Convert.ToBase64String(Encoding.UTF8.GetBytes("ValidData")),
                AppointmentDate = DateTime.Today,
                StartTime = "10:00 AM",
                EndTime = "11:00 AM"
            };

            _mockBookRepo.Setup(r => r.BookAppointment(It.IsAny<BookAppointment>()))
                         .ReturnsAsync(0);

            var result = await _service.BookAppointmentAsync(dto, "user1", 100, "Card");

            Assert.False(result.IsSuccess);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("Failed to book the appointment", result.Message);
        }

        [Fact]
        public async Task BookAppointmentAsync_SuccessfulBooking_ReturnsSuccess()
        {
            var dto = new AppointmentDto
            {
                DoctorId = Convert.ToBase64String(Encoding.UTF8.GetBytes("ValidData")),
                AppointmentDate = DateTime.Today,
                StartTime = "10:00 AM",
                EndTime = "11:00 AM"
            };

            _mockBookRepo.Setup(r => r.BookAppointment(It.IsAny<BookAppointment>()))
                         .ReturnsAsync(1);

            _mockDoctorAvailabilityRepo.Setup(r =>
                    r.GetAvailabilityBySlotAsync("DecryptedDoctorId", dto.AppointmentDate, dto.StartTime))
                .ReturnsAsync(new DoctorAvailability { IsBooked = false });

            _mockDoctorAvailabilityRepo.Setup(r => r.UpdateAvailabilityAsync(It.IsAny<DoctorAvailability>()))
                .Returns(Task.CompletedTask);

            _mockBookRepo.Setup(r => r.Paymentasync(It.IsAny<Payment>()))
                .ReturnsAsync(true);

            _mockUserManager.Setup(m => m.FindByIdAsync("user1"))
                .ReturnsAsync(new ApplicationUser { Email = "patient@example.com", FullName = "Patient Name" });

            _mockUserManager.Setup(m => m.FindByIdAsync("DecryptedDoctorId"))
                .ReturnsAsync(new ApplicationUser { FullName = "Dr. John" });

            _mockMailService.Setup(m => m.SendBookingConfirmationEmail(
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<DateTime>(),
                It.IsAny<string>()
            )).Returns(Task.CompletedTask);

            var result = await _service.BookAppointmentAsync(dto, "user1", 100, "Card");

            Assert.True(result.IsSuccess);
            Assert.Equal(201, result.StatusCode);
            Assert.Equal("Dr. John", result.Data);
        }

        [Fact]
        public async Task BookAppointmentAsync_PaymentFailed_ReturnsBadRequest()
        {
            var dto = new AppointmentDto
            {
                DoctorId = Convert.ToBase64String(Encoding.UTF8.GetBytes("ValidData")),
                AppointmentDate = DateTime.Today,
                StartTime = "10:00 AM",
                EndTime = "11:00 AM"
            };

            _mockBookRepo.Setup(r => r.BookAppointment(It.IsAny<BookAppointment>()))
                         .ReturnsAsync(1);

            _mockDoctorAvailabilityRepo.Setup(r =>
                    r.GetAvailabilityBySlotAsync("DecryptedDoctorId", dto.AppointmentDate, dto.StartTime))
                .ReturnsAsync(new DoctorAvailability());

            _mockBookRepo.Setup(r => r.Paymentasync(It.IsAny<Payment>()))
                .ReturnsAsync(false);

            var result = await _service.BookAppointmentAsync(dto, "user1", 100, "UPI");

            Assert.False(result.IsSuccess);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("something went Wrong", result.Message);
        }
    }



}