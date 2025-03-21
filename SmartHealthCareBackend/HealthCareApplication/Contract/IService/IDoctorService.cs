﻿using HealthCareApplication.Dtos.CommentDto;
using HealthCareApplication.Dtos.UserDto;
using HealthCareApplication.Dtos.UserDtoo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Contract.IService
{
    public interface IDoctorService
    {
        Task<ApiResponseDto> AddProfileDetails(AddProfileDto addProfileDto);
        Task<ApiResponseDto> CreateOrUpdateDoctorAdditionalInfo(AdditionalnfoDto request);
        Task <IEnumerable<DoctorDetailsDto>> SearchDoctorAsync(SearchDto searchDto);
        Task<ApiResponseDto> GetDoctorDetails(string Id);
        Task<ApiResponseDto> GetLoginDoctorService(string Id);

        Task<ApiResponseDto> DoCommentAsync(CommentDtoo commentDtoo);
        Task<ApiResponseDto> DoReplyAsync(ReplyDto reply);
        Task<ApiResponseDto> GetCommentsAsync(string Id);
        Task<ApiResponseDto> GetReplyAsync(int Id);
        Task<ApiResponseDto> GetDoctorRevenueAsync(string Id);
        Task<ApiResponseDto> GetDoctorNotificationAsync(string Id);
        Task<ApiResponseDto> MarkNotificationAsReadAsync(string Id);
    }
}
