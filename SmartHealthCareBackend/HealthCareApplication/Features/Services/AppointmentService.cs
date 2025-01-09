using HealthCareApplication.Contract.IService;
using HealthCareApplication.Dtos.AvailabilityDto;
using HealthCareApplication.Dtos.UserDto;
using HealthCareDomain.Entity.Appointment;
using HealthCareDomain.IRepository;
using HealthCarePersistence.Repository;
using System;
using System.Threading.Tasks;

namespace HealthCareApplication.Features.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IBookAppointmentRepository _bookAppointmentRepository;
        private readonly IDoctorAvailabilityRepository _doctorAvailabilityRepository;
         

        public AppointmentService(IBookAppointmentRepository bookAppointmentRepository, IDoctorAvailabilityRepository doctorAvailabilityRepository)
        {
            _bookAppointmentRepository = bookAppointmentRepository;
            _doctorAvailabilityRepository = doctorAvailabilityRepository;
        }

        public async Task<ApiResponseDto> BookAppointmentAsync(AppointmentDto appointmentDto)
        {


            try
            {
               
                var appointment = new BookAppointment
                {
                    DoctorId = appointmentDto.DoctorId,
                    PatientId = appointmentDto.PatientId,
                    AppointmentDate = appointmentDto.Date,
                    Slot = appointmentDto.TimeSlot,  //starttime halney
                    Status = "Booked",
                    PaymentStatus = "Pending"
                };

                var isAppointmentBooked = await _bookAppointmentRepository.BookAppointment(appointment);

               
                if (isAppointmentBooked)
                {
                    var availabilitySlot = await _doctorAvailabilityRepository.GetAvailabilityBySlotAsync(appointmentDto.DoctorId, appointmentDto.Date, appointmentDto.TimeSlot);
                    if (availabilitySlot != null)
                    {
                        availabilitySlot.IsBooked = true;
                        await _doctorAvailabilityRepository.UpdateAvailabilityAsync(availabilitySlot);
                    }

                    return new ApiResponseDto
                    {
                        IsSuccess = true,
                        Message = "Appointment booked successfully",
                        StatusCode = 201
                    };
                }
                else
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = "Failed to book the appointment",
                        StatusCode = 400
                    };
                }
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
    }
}
