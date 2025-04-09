using HealthCareApplication.Contract.IService;
using HealthCareApplication.Dtos.AvailabilityDto;
using HealthCareApplication.Dtos.UserDto;
using HealthCareDomain.Entity.Appointment;
using HealthCareDomain.Entity.UserEntity;
using HealthCareDomain.IRepository;
using HealthCareInfrastructure.DataSecurity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.DataProtection;
using System;
using System.Threading.Tasks;
using HealthCareDomain.Contract.ContractDto.NewFolder;
using HealthCareApplication.Contracts.Email;
using HealthCareDomain.Entity.Chat;
using Microsoft.AspNetCore.Http;
using HealthCareApplication.Dtos.CommentDto;
using Microsoft.AspNetCore.Http.HttpResults;
using HealthCareApplication.Contracts.IService;
using Sprache;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.AspNetCore.Mvc;

namespace HealthCareApplication.Features.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IBookAppointmentRepository _bookAppointmentRepository;
        private readonly IDoctorAvailabilityRepository _doctorAvailabilityRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IDataProtector _dataProtector;
        private readonly IMailService _mailService;
        private readonly IFileService _fileService;

        public AppointmentService(UserManager<ApplicationUser> userManager, IBookAppointmentRepository bookAppointmentRepository,IDoctorAvailabilityRepository doctorAvailabilityRepository, DataSecurityProvider securityProvider, IDataProtectionProvider dataProtector, IMailService mailService, IFileService fileService)
        {
            _bookAppointmentRepository = bookAppointmentRepository;
            _doctorAvailabilityRepository = doctorAvailabilityRepository;
            _mailService = mailService;
            _userManager = userManager;
            _dataProtector = dataProtector?.CreateProtector(securityProvider.securityKey);
            _fileService = fileService;
        }

        public async Task<ApiResponseDto> BookAppointmentAsync(AppointmentDto appointmentDto, string userId, decimal total_Amount, string PaymentMethod)
        {
            if (appointmentDto == null)
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid appointment details",
                    StatusCode = 400
                };

            if (string.IsNullOrEmpty(userId))
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid user ID",
                    StatusCode = 400
                };

            try
            {
                // Decrypt the doctor ID
                string doctorId;
                try
                {
                    doctorId = _dataProtector.Unprotect(appointmentDto.DoctorId);
                }
                catch (Exception ex)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = $"Invalid doctor ID: {ex.Message}",
                        StatusCode = 400
                    };
                }

                // Create the appointment entity
                var appointment = new BookAppointment
                {
                    DoctorId = doctorId,
                    PatientId = userId,
                    AppointmentDate = appointmentDto.AppointmentDate,
                    Slot = appointmentDto.StartTime,
                    EndTime = appointmentDto.EndTime,
                    Status = "Booked",
                    PaymentStatus = "Paid",
                    MeetingId = Guid.NewGuid().ToString()

                };

                // Save the appointment to the database and get the appointment ID
                var bookedAppointmentId = await _bookAppointmentRepository.BookAppointment(appointment);

                if (bookedAppointmentId <= 0)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = "Failed to book the appointment",
                        StatusCode = 400
                    };
                }

                // Update doctor availability
                var availabilitySlot = await _doctorAvailabilityRepository.GetAvailabilityBySlotAsync(doctorId, appointmentDto.AppointmentDate, appointmentDto.StartTime);
                if (availabilitySlot != null)
                {
                    availabilitySlot.IsBooked = true;
                    await _doctorAvailabilityRepository.UpdateAvailabilityAsync(availabilitySlot);
                }

                var payment = new Payment
                {
                    Amount = total_Amount,
                    PaymentDate = DateTime.Now,
                    Status = "Paid",
                    AppointmentId = bookedAppointmentId,
                    PaymentMethod = PaymentMethod
                };


                var Payment = await _bookAppointmentRepository.Paymentasync(payment);
                // Return success response

                if(Payment == true)
                {
                    var patient = await _userManager.FindByIdAsync(userId);

                    var userEmail = patient!.Email;
                    var userName = patient!.FullName;
                    var doctor = await _userManager.FindByIdAsync(doctorId);
                    await _mailService.SendBookingConfirmationEmail(userEmail!, userName, appointment.MeetingId, doctor.FullName, appointment.AppointmentDate, appointment.Slot);
                   

                    return new ApiResponseDto
                    {
                        IsSuccess = true,
                        Message = "Appointment booked successfully",
                        StatusCode = 201,
                        Data = doctor!.FullName // Include the appointment ID in the response
                    };
                }

                // Log exception (if logging is set up)
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = $"something went Wrong",
                    StatusCode = 400
                };

            }
            catch (Exception ex)
            {
                // Log exception (if logging is set up)
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = $"An error occurred: {ex.Message}",
                    StatusCode = 500
                };
            }
        }

        public async Task<ApiResponseDto> CheckforCommentAsync(string DoctorId, string UserId)
        {
            try
            {
                if (UserId == null || DoctorId == null)
                {

                    return new ApiResponseDto
                    {

                        IsSuccess = false,
                        Message = "Id is not availbale",
                        StatusCode = 400
                    };
                };

                var id = _dataProtector.Unprotect(DoctorId);

                var response = await _bookAppointmentRepository.CheckCommentValidaton(id, UserId);    

                if(response != true)
                {

                    return new ApiResponseDto
                    {

                        IsSuccess = false,
                        Message = "No Booking",
                        StatusCode = 422
                    };

                }


                return new ApiResponseDto
                {

                    IsSuccess = true,
                    Message = "Booking available",
                    StatusCode = 200
                };


            }
            catch (Exception ex)
            {
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = $"An error occurred: {ex.Message}",
                    StatusCode = 500
                };


            }
        }

        public async Task<ApiResponseDto> ChecKMeetingIdAsync(string MeetingId)
        {
            if (string.IsNullOrEmpty(MeetingId))
            {
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid input parameters.",
                    StatusCode = 400
                };
            }

            try
            {
                var checkIds = await _bookAppointmentRepository.CheckIds(MeetingId);

                if (checkIds)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = true,
                        Message = "Valid Token",
                        StatusCode = 200
                    };
                }

                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid Token",
                    StatusCode = 400
                };
            }
            catch (Exception ex)
            {

                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = $"An error occurred: {ex.Message}",
                    StatusCode = 500
                };
            }
        }


        public async Task<ApiResponseDto> GetAppointmentListAsync(string userId, string role)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(role))
            {
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid input parameters.",
                    StatusCode = 400
                };
            }

            try
            {
                object result = null;

                switch (role)
                {
                    case "Doctor":
                        result = await _bookAppointmentRepository.GetListByIdAsync(userId);
                        break;

                    case "Patient":
                        result = await _bookAppointmentRepository.GetDoctorListByIdAsync(userId);
                        break;

                    default:
                        return new ApiResponseDto
                        {
                            IsSuccess = false,
                            Message = "Invalid role specified.",
                            StatusCode = 400
                        };
                }

                if (result == null)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = "Not Found",
                        StatusCode = 404 
                    };
                }

                return new ApiResponseDto
                {
                    IsSuccess = true,
                    Message = "Success",
                    StatusCode = 200,
                    Data = result
                };
            }
            catch (Exception ex)
            {

                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = $"An error occurred: {ex.Message}",
                    StatusCode = 500
                };
            }
        }

        public async Task<ApiResponseDto> UploadVideoAsync(IFormFile videoFile, string meetingId)
        {
            try
            {
                if (videoFile == null || videoFile.Length == 0)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = "No video file found",
                        StatusCode = 400
                    };
                }

              
                var uploads = await _fileService.SaveFileAsync(videoFile, "Uploads");

            
                var addVideo = await _bookAppointmentRepository.AddVideoFileAsync(uploads, meetingId);

                if (addVideo)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = true,
                        Message = "Video uploaded successfully",
                        StatusCode = 200
                    };
                }

               
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "Failed to add video to the appointment",
                    StatusCode = 500
                };
            }
            catch (Exception ex)
            {
                

                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = $"An error occurred: {ex.Message}",
                    StatusCode = 500
                };
            }
        }

        public async Task<ApiResponseDto> UserAppointmentsAsync(string userId)
        {
            try
            {

                var appointments = await _bookAppointmentRepository.GetAllAppointemntsById(userId);

             
                foreach(var appointment in appointments)
                {
                    appointment.DoctorId = _dataProtector.Protect(appointment.DoctorId);
                }
                return new ApiResponseDto
                {
                    IsSuccess = true,
                    Message = "Appointments retrieved successfully",
                    StatusCode = 200,
                    Data = appointments
                };



            }
            catch(Exception ex)
            {
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = $"An error occurred: {ex.Message}",
                    StatusCode = 500
                };
            }
        }
    }
}
