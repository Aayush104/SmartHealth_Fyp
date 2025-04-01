using Azure.Core;
using HealthCareApplication.Contract.IService;
using HealthCareApplication.Contracts.IService;
using HealthCareApplication.Dtos.AvailabilityDto;
using HealthCareApplication.Dtos.CommentDto;
using HealthCareApplication.Dtos.NotificationDto;
using HealthCareApplication.Dtos.UserDto;
using HealthCareApplication.Dtos.UserDtoo;
using HealthCareApplication.NotificationHub;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Review;
using HealthCareDomain.Entity.UserEntity;
using HealthCareInfrastructure.DataSecurity;
using HealthCarePersistence.IRepository;
using HealthCarePersistence.Migrations;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using static System.Reflection.Metadata.BlobBuilder;

namespace HealthCareApplication.Features.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IHubContext<Notificationhub> _hubContext;
        private readonly IDataProtector _dataProtector;
        private readonly IFileService _fileService;
        public DoctorService(UserManager<ApplicationUser> userManager, IHubContext<Notificationhub> hubContext, IDoctorRepository doctorRepository, IDataProtectionProvider dataProtector, DataSecurityProvider securityProvider, IFileService fileService)
        {
            _userManager = userManager;
            _doctorRepository = doctorRepository;
            _fileService = fileService;
            _dataProtector = dataProtector.CreateProtector(securityProvider.securityKey);
            _hubContext = hubContext ?? throw new ArgumentNullException(nameof(hubContext));
        }

        public async Task<ApiResponseDto> AddProfileDetails(AddProfileDto addProfileDto)
        {
            var userId = addProfileDto.userId;

            // Check if the doctor exists
            var existingDoctor = await _doctorRepository.GetDoctorBYId(userId);
            if (existingDoctor == null)
            {
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "Doctor profile not found",
                    StatusCode = 404
                };
            }

            // Update doctor profile details if values are provided
            existingDoctor.Experience = !string.IsNullOrWhiteSpace(addProfileDto.Experience)
                                        ? addProfileDto.Experience
                                        : existingDoctor.Experience;

            existingDoctor.FromDay = !string.IsNullOrWhiteSpace(addProfileDto.FromDay)
                                     ? addProfileDto.FromDay
                                     : existingDoctor.FromDay;

            existingDoctor.ToDay = !string.IsNullOrWhiteSpace(addProfileDto.ToDay)
                                   ? addProfileDto.ToDay
                                   : existingDoctor.ToDay;

            existingDoctor.FromTime = !string.IsNullOrWhiteSpace(addProfileDto.FromTime)
                                      ? addProfileDto.FromTime
                                      : existingDoctor.FromTime;

            existingDoctor.ToTime = !string.IsNullOrWhiteSpace(addProfileDto.ToTime)
                                    ? addProfileDto.ToTime
                                    : existingDoctor.ToTime;

            existingDoctor.Description = !string.IsNullOrWhiteSpace(addProfileDto.Description)
                                         ? addProfileDto.Description
                                         : existingDoctor.Description;

            existingDoctor.Fee = !string.IsNullOrWhiteSpace(addProfileDto.Fee)
                                 ? addProfileDto.Fee
                                 : existingDoctor.Fee;

            // Handle profile picture upload
            if (addProfileDto.Profile != null)
            {
                try
                {
                    existingDoctor.Profile= await _fileService.SaveFileAsync(addProfileDto.Profile, "Profile");
                    
                }
                catch (Exception ex)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = $"Failed to upload profile picture: {ex.Message}",
                        StatusCode = 500
                    };
                }
            }

            // Update the doctor details in the repository
            await _doctorRepository.UpdateDoctorAsync(existingDoctor);

            return new ApiResponseDto
            {
                IsSuccess = true,
                Message = "Doctor profile updated successfully",
                StatusCode = 200
            };
        }

        public async Task<ApiResponseDto> CreateOrUpdateDoctorAdditionalInfo(AdditionalnfoDto request)
        {
            try
            {
                // First, get all existing records for this user
                var existingRecords = await _doctorRepository.GetByUserIdFromAdditionalAsync(request.UserId);

                // If there are existing records, delete them all first
                // This is the cleanest approach to avoid duplicate entries
                if (existingRecords.Any())
                {
                    foreach (var record in existingRecords)
                    {
                        await _doctorRepository.DeleteAdditionalAsync(record);
                    }
                }

                // Now add all the new experiences and trainings
                // We'll use the longer of the two lists to determine how many records to create
                int maxCount = Math.Max(request.Experiences.Count, request.Trainings.Count);

                for (int i = 0; i < maxCount; i++)
                {
                    var newRecord = new DoctorAdditionalInfo
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserId = request.UserId,
                        ExperienceDetail = i < request.Experiences.Count ? request.Experiences[i] : null,
                        Trainings = i < request.Trainings.Count ? request.Trainings[i] : null
                    };

                    await _doctorRepository.AddAdditionalInfoAsync(newRecord);
                }

                return new ApiResponseDto
                {
                    IsSuccess = true,
                    Message = existingRecords.Any() ? "Additional Info Updated Successfully" : "Additional Info Added Successfully",
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

        //public async Task<ApiResponseDto> CreateOrUpdateDoctorAdditionalInfo(AdditionalnfoDto request)
        //{
        //    try
        //    {
        //        var existingRecords = await _doctorRepository.GetByUserIdFromAdditionalAsync(request.UserId);

        //        int experienceIndex = 0, trainingIndex = 0;

        //        // Update existing records with missing values
        //        foreach (var record in existingRecords)
        //        {
        //            if (string.IsNullOrEmpty(record.ExperienceDetail) && experienceIndex < request.Experiences.Count)
        //            {
        //                record.ExperienceDetail = request.Experiences[experienceIndex++];
        //            }

        //            if (string.IsNullOrEmpty(record.Trainings) && trainingIndex < request.Trainings.Count)
        //            {
        //                record.Trainings = request.Trainings[trainingIndex++];
        //            }

        //            await _doctorRepository.UpdateAdditionalAsync(record);
        //        }

        //        // Add new records for remaining experiences and trainings
        //        while (experienceIndex < request.Experiences.Count || trainingIndex < request.Trainings.Count)
        //        {
        //            var newRecord = new DoctorAdditionalInfo
        //            {
        //                Id = Guid.NewGuid().ToString(),
        //                UserId = request.UserId,
        //                ExperienceDetail = experienceIndex < request.Experiences.Count ? request.Experiences[experienceIndex++] : null,
        //                Trainings = trainingIndex < request.Trainings.Count ? request.Trainings[trainingIndex++] : null
        //            };

        //            await _doctorRepository.AddAdditionalInfoAsync(newRecord);
        //        }


        //        return new ApiResponseDto
        //        {
        //            IsSuccess = true,
        //            Message = "Additional Info Added Successfully",
        //            StatusCode = 200
        //        };
        //    }
        //    catch (Exception ex)
        //    {

        //        return new ApiResponseDto
        //        {
        //            IsSuccess = false,
        //            Message = $"An error occurred: {ex.Message}",
        //            StatusCode = 500
        //        };
        //    }
        //}

        public async Task<ApiResponseDto> DoCommentAsync(CommentDtoo commentDtoo)
        {
            try
            {
                var doctorId = _dataProtector.Unprotect(commentDtoo.DoctorId);
                var comments = new Comments
                {
                    PatientId = commentDtoo.PatientId,
                    DoctorId = doctorId,
                    UserName = commentDtoo.UserName,
                    VisitedFor = commentDtoo.VisitedFor,
                    IsRecommended = commentDtoo.IsRecommended,
                    ReviewText = commentDtoo.ReviewText,
                    CreatedAt = DateTime.Now,
                };

                await _doctorRepository.AddComment(comments);

                // Send a more detailed notification
                string notificationMessage = $"{commentDtoo.UserName} left a new review: {commentDtoo.ReviewText.Substring(0, Math.Min(50, commentDtoo.ReviewText.Length))}";
                if (commentDtoo.ReviewText.Length > 50)
                    notificationMessage += "...";

                await _hubContext.Clients.All.SendAsync("ReceiveNotification", notificationMessage);

                return new ApiResponseDto
                {
                    IsSuccess = true,
                    Message = "Comment Successful",
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

        public async Task<ApiResponseDto> DoReplyAsync(ReplyDto reply)
        {

            var doctorId = _dataProtector.Unprotect(reply.DoctorId);
            try
            {
              

                var replies = new Reply
                {
                    CommentId = reply.CommentId,
                    DoctorId = doctorId,
                    ReplyText = reply.ReplyText,
                    CreatedAt = DateTime.Now,
                };
                await _doctorRepository.AddReply(replies);
                return new ApiResponseDto
                {
                    IsSuccess = true,
                    Message = "Reply Succesfull",
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

        public async Task<ApiResponseDto> GetCommentsAsync(string Id)
        {
            try
            {
                string doctorId;

                try
                {
                    doctorId = _dataProtector.Unprotect(Id);
                }
                catch (Exception)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = "Invalid or corrupted doctor Id",
                        StatusCode = 400
                    };
                }

                if (string.IsNullOrWhiteSpace(doctorId))
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = "Doctor Id is required",
                        StatusCode = 400
                    };
                }

                var getComments = await _doctorRepository.GetCommentsAsync(doctorId);

                if (getComments == null || !getComments.Any())
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = true,
                        Message = "No comments found",
                        StatusCode = 200,
                        Data = new List<GetCommentsDto>()
                    };
                }

                var comments = getComments.Select(a => new GetCommentsDto
                {
                    CommentId =  a.Id,
                    UserName = a.UserName,
                    VisitedFor = a.VisitedFor,
                    ReviewText = a.ReviewText,
                    IsRecommended = a.IsRecommended,
                   
                    CreatedAt = a.CreatedAt,
                }).ToList();

                return new ApiResponseDto
                {
                    IsSuccess = true,
                    Data = comments,
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


        public async Task<ApiResponseDto> GetDoctorDetails(string Id)
        {
            try
            {
                string doctorId;

                // Try to decrypt the ID
                try
                {
                    doctorId = _dataProtector.Unprotect(Id);
                }
                catch
                {
                    // If decryption fails, assume it's already in plain text
                    doctorId = Id;
                }

                // Fetch doctor details
                var doctorDetails = await _doctorRepository.GetDoctorBYId(doctorId);
                if (doctorDetails == null)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = "Doctor not found.",
                        StatusCode = 404
                    };
                }

                // Fetch additional records
                var existingRecords = await _doctorRepository.GetByUserIdFromAdditionalAsync(doctorId);

                // Extract experiences and trainings
                var experiences = existingRecords
                    .Where(a => !string.IsNullOrEmpty(a.ExperienceDetail))
                    .Select(d => d.ExperienceDetail)
                    .ToList();

                var trainings = existingRecords
                    .Where(a => !string.IsNullOrEmpty(a.Trainings))
                    .Select(d => d.Trainings)
                    .ToList();

                // Map data to DTO
                var doctor = new DoctorDetailsDto
                {
                    Id = doctorDetails.Id,
                    FullName = doctorDetails.User.FullName,
                    Email = doctorDetails.User.Email,
                    Specialization = doctorDetails.Specialization,
                    Qualifications = doctorDetails.Qualifications,
                    Loction = doctorDetails.Location,
                    Description = doctorDetails.Description,
                    Profileget = doctorDetails.Profile,
                    Fee = doctorDetails.Fee,
                    Experience = doctorDetails.Experience,
                    phoneNumber = doctorDetails.User.PhoneNumber,
                    GovernmentIdFile = doctorDetails.GovernmentIdFilePath,
                    QualificationsFile = doctorDetails.QualificationsFilePath,
                    LicenseFile = doctorDetails.LicenseFilePath,
                    FromDay = doctorDetails.FromDay,
                    FromTime = doctorDetails.FromTime,
                    ToDay = doctorDetails.ToDay,
                    ToTime = doctorDetails.ToTime
                    
                };

                // Map additional info
                var additionalInfo = new AdditionalnfoDto
                {
                    Experiences = experiences,
                    Trainings = trainings
                };

                // Create response
                return new ApiResponseDto
                {
                    IsSuccess = true,
                    Data = new { doctor, additionalInfo },
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                // Handle and log the exception
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = $"An error occurred: {ex.Message}",
                    StatusCode = 500
                };
            }
        }



        public async Task<ApiResponseDto> GetDoctorNotificationAsync(string Id)
        {
            try
            {
                var result = await _doctorRepository.DoctorNotificationById(Id);

              
                if (result == null || !result.Any())
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = false,
                        Message = "No notifications found for this doctor.",
                        StatusCode = 404
                    };
                }

                
                var notificationDetails = result.Select(comment => new Notificationdto
                {
                    DoctorId = _dataProtector.Protect(comment.DoctorId),
                    UserName = comment.UserName,
                    ReviewText = comment.ReviewText,
                    CreatedAt = comment.CreatedAt,
                    MarkAs = comment.MarkAs

                }).ToList();

                return new ApiResponseDto
                {
                    IsSuccess = true,
                    Data = notificationDetails,  
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

        public async Task<ApiResponseDto> GetDoctorRevenueAsync(string Id)
        {
            try
            {

                var result = await _doctorRepository.DoctorRevenuesById(Id);
                return new ApiResponseDto
                {
                    IsSuccess = true,
                    Data = result, 
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

        public async Task<ApiResponseDto> GetLoginDoctorService(string Id)
        {
            try
            {
                var doctorDetails = await _doctorRepository.GetDoctorBYId(Id);

                var existingRecords = await _doctorRepository.GetByUserIdFromAdditionalAsync(Id);

                // Extract experiences and trainings
                var experiences = existingRecords
                    .Where(a => !string.IsNullOrEmpty(a.ExperienceDetail))
                    .Select(d => d.ExperienceDetail)
                    .ToList();

                var trainings = existingRecords
                    .Where(a => !string.IsNullOrEmpty(a.Trainings))
                    .Select(d => d.Trainings)
                    .ToList();

                // Map data to DoctorDetailsDto
                var doctor = new DoctorDetailsDto
                {
                    Id = _dataProtector.Protect(doctorDetails.Id),
                    FullName = doctorDetails.User.FullName,
                    Email = doctorDetails.User.Email,
                    Specialization = doctorDetails.Specialization,
                    Qualifications = doctorDetails.Qualifications,
                    Loction = doctorDetails.Location,
                    Description = doctorDetails.Description,
                    Profileget = doctorDetails.Profile,
                    Fee = doctorDetails.Fee,
                    Experience = doctorDetails.Experience,
                };

                // Map additional info
                var additionalInfo = new AdditionalnfoDto
                {
                    Experiences = experiences,
                    Trainings = trainings,
                };

                // Create the response
                return new ApiResponseDto
                {
                    IsSuccess = true,
                    Data = new { doctor, additionalInfo }, // Anonymous object
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                // Handle and log the exception
                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = $"An error occurred: {ex.Message}",
                    StatusCode = 500
                };
            }
        }

        public async Task<ApiResponseDto> GetReplyAsync(int Id)
        {
            try
            {
                var getReply = await _doctorRepository.GetReplyAsync(Id);

                if (getReply == null || !getReply.Any())
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = true,
                        Message = "No comments found",
                        StatusCode = 200,
                        Data = new List<GetCommentsDto>()
                    };
                }

                var comments = getReply.Select(a => new ReplyDto
                {
                    CommentId = a.CommentId,
                    DoctorId = a.DoctorId,
                    ReplyText = a.ReplyText,
                    CreatedAt = a.CreatedAt
                }).ToList();

                return new ApiResponseDto
                {
                    IsSuccess = true,
                    Data = comments,
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

        public async Task<ApiResponseDto> MarkNotificationAsReadAsync(string Id)
        {
            try
            {
                var updateNotificationStatus = await _doctorRepository.UpdateNotificationStatus(Id);

                if (updateNotificationStatus)
                {
                    return new ApiResponseDto
                    {
                        IsSuccess = true,
                        Message = "Marked all as read",
                        StatusCode = 200
                    };
                }

                return new ApiResponseDto
                {
                    IsSuccess = false,
                    Message = "No notifications found or update failed",
                    StatusCode = 404
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

        public async Task<IEnumerable<DoctorDetailsDto>> SearchDoctorAsync(SearchDto searchDto)
        {
            try
            {
                var filteredDoctors = await _doctorRepository.SearchDoctors(searchDto.Speciality, searchDto.Location);

             

                var doctorList = filteredDoctors.Select(doctor => new DoctorDetailsDto
                {
                    
                    userId = _dataProtector.Protect(doctor.Id),
                    FullName = doctor.User.FullName,
                    Profileget = doctor.Profile,
                 
                    Specialization = doctor.Specialization,
                   
                    Qualifications = doctor.Qualifications,
                  
                  
                  
                    //Location = doctor.Location,
                   
                    Experience = doctor.Experience,
                }).ToList();

             

                return doctorList;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching doctors.", ex);
            }
        }


        
    }
}
 