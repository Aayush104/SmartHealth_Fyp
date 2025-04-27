//using HealthCareApplication.Dtos.AvailabilityDto;
//using HealthCareDomain.Entity.Doctors;
//using HealthCareDomain.IServices;
//using HealthCareDomain.IRepository;
//using System;
//using System.Collections.Generic;
//using System.Threading.Tasks;
//using HealthCareApplication.Dtos.UserDto;
//using HealthCarePersistence.IRepository;
//using Microsoft.AspNetCore.Http.HttpResults;
//using Microsoft.AspNetCore.DataProtection;
//using HealthCareInfrastructure.DataSecurity;

//namespace HealthCareApplication.Features.Services
//{
//    public class DoctorAvailabilityService : IDoctorAvailabiltyService
//    {
//        private readonly IDoctorAvailabilityRepository _doctorAvailabilityRepository;
//        private readonly IDoctorRepository _doctorRepository;
//        private readonly IDataProtector _dataProtector;

//        public DoctorAvailabilityService(IDoctorAvailabilityRepository doctorAvailabilityRepository, IDoctorRepository doctorRepository, IDataProtectionProvider dataProtector, DataSecurityProvider securityProvider)
//        {
//            _doctorAvailabilityRepository = doctorAvailabilityRepository;
//            _doctorRepository = doctorRepository;
//            _dataProtector = dataProtector.CreateProtector(securityProvider.securityKey);
//        }

//        public async Task<ApiResponseDto> GenerateSlotsAsync(DoctorAvailabilityDto doctorAvailabilityDto)
//        {
//            try
//            {
//                var slots = new List<DoctorAvailability>();

//                var doctor = await _doctorRepository.GetDoctorBYId(doctorAvailabilityDto.DoctorId);

//                if (doctor == null)
//                {
//                    return new ApiResponseDto
//                    {
//                        IsSuccess = false,
//                        Message = "Doctor does not exist",
//                        StatusCode = 404
//                    };
//                }


//                foreach (var timeslot in doctorAvailabilityDto.TimeSlots)
//                {
//                    var start = DateTime.Parse(timeslot.StartTime);
//                    var end = DateTime.Parse(timeslot.EndTime);
//                    var duration = timeslot.SlotDuration;

//                    while (start < end)
//                    {
//                        var slotEnd = start.AddMinutes(duration);

//                        if (slotEnd <= end)
//                        {
//                            slots.Add(new DoctorAvailability
//                            {
//                                StartTime = start.ToString("HH:mm"),
//                                EndTime = slotEnd.ToString("HH:mm"),
//                                SlotDuration = duration,
//                                DoctorId = doctorAvailabilityDto.DoctorId,
//                                Date = DateTime.Parse(timeslot.Date),
//                                IsBooked = false
//                            });
//                        }

//                        start = start.AddMinutes(duration);
//                    }
//                }


//                await _doctorAvailabilityRepository.SaveSlotsAsync(slots);

//                return new ApiResponseDto
//                {
//                    IsSuccess = true,
//                    Message = "Slots generated and saved successfully",

//                    StatusCode = 201
//                };
//            }
//            catch (Exception ex)
//            {

//                return new ApiResponseDto
//                {
//                    IsSuccess = false,
//                    Message = $"Internal server error: {ex.Message}",
//                    StatusCode = 500
//                };
//            }
//        }

//        public async Task<List<DoctorAvailabilityDto>> GetAvailabilityAsync(string userId)
//        {
//            try
//            {

//                 var doctorId = _dataProtector.Unprotect(userId);


//                var availability = await _doctorAvailabilityRepository.GetSlotsAsync(doctorId);

//                var availabilityDto = availability
//                    .GroupBy(slot => slot.Date) // Group slots by date
//                    .Select(group => new DoctorAvailabilityDto
//                    {
//                        DoctorId = _dataProtector.Protect(doctorId),

//                        TimeSlots = group.Select(slot => new TimeSlot
//                        {
//                            StartTime = slot.StartTime, 
//                            EndTime = slot.EndTime  ,
//                            Date = group.Key.ToString("yyyy-MM-dd"),
//                            SlotDuration  = slot.SlotDuration
//                        }).ToList()
//                    }).ToList();

//                return availabilityDto; 
//            }
//            catch (Exception ex)
//            {
//                throw new Exception("An error occurred while fetching doctor availability details.", ex);
//            }
//        }
//    }

//}



using HealthCareApplication.Dtos.AvailabilityDto;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.IServices;
using HealthCareDomain.IRepository;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HealthCareApplication.Dtos.UserDto;
using HealthCarePersistence.IRepository;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.DataProtection;
using HealthCareInfrastructure.DataSecurity;

namespace HealthCareApplication.Features.Services
{
    public class DoctorAvailabilityService : IDoctorAvailabiltyService
    {
        private readonly IDoctorAvailabilityRepository _doctorAvailabilityRepository;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IDataProtector _dataProtector;

        public DoctorAvailabilityService(
            IDoctorAvailabilityRepository doctorAvailabilityRepository,
            IDoctorRepository doctorRepository,
            IDataProtectionProvider dataProtector,
            DataSecurityProvider securityProvider)
        {
            _doctorAvailabilityRepository = doctorAvailabilityRepository;
            _doctorRepository = doctorRepository;
            _dataProtector = dataProtector.CreateProtector(securityProvider.securityKey);
        }

        public async Task<ApiResponseDto> GenerateSlotsAsync(DoctorAvailabilityDto doctorAvailabilityDto)
        {
            try
            {
                var slots = new List<DoctorAvailability>();

                var doctor = await _doctorRepository.GetDoctorBYId(doctorAvailabilityDto.DoctorId);

                if (doctor == null)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = "Doctor does not exist",
                        StatusCode = 404
                    };
                }

                foreach (var timeslot in doctorAvailabilityDto.TimeSlots)
                {
                    var start = DateTime.Parse(timeslot.StartTime);
                    var end = DateTime.Parse(timeslot.EndTime);
                    var duration = timeslot.SlotDuration;

                    while (start < end)
                    {
                        var slotEnd = start.AddMinutes(duration);

                        if (slotEnd <= end)
                        {
                            slots.Add(new DoctorAvailability
                            {
                                StartTime = start.ToString("HH:mm"),
                                EndTime = slotEnd.ToString("HH:mm"),
                                SlotDuration = duration,
                                DoctorId = doctorAvailabilityDto.DoctorId,
                                Date = DateTime.Parse(timeslot.Date),
                                IsBooked = false
                            });
                        }

                        start = start.AddMinutes(duration);
                    }
                }

                await _doctorAvailabilityRepository.SaveSlotsAsync(slots);

                return new ApiResponseDto
                {
                    IsSuccess = true,
                    Message = "Slots generated and saved successfully",
                    StatusCode = 201
                };
            }
            catch (Exception ex)
            {
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = $"Internal server error: {ex.Message}",
                    StatusCode = 500
                };
            }
        }

        public async Task<List<DoctorAvailabilityDto>> GetAvailabilityAsync(string userId)
        {
            try
            {
                var doctorId = _dataProtector.Unprotect(userId);
                var availability = await _doctorAvailabilityRepository.GetSlotsAsync(doctorId);

                var availabilityDto = availability
                    .GroupBy(slot => slot.Date)
                    .Select(group => new DoctorAvailabilityDto
                    {
                        DoctorId = _dataProtector.Protect(doctorId),
                        TimeSlots = group.Select(slot => new TimeSlot
                        {
                            StartTime = slot.StartTime,
                            EndTime = slot.EndTime,
                            Date = group.Key.ToString("yyyy-MM-dd"),
                            SlotDuration = slot.SlotDuration
                        }).ToList()
                    }).ToList();

                return availabilityDto;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching doctor availability details.", ex);
            }
        }
    }
}
