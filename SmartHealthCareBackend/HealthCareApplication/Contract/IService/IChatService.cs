﻿using HealthCareApplication.Dtos.UserDto;
using HealthCareDomain.Contract.ContractDto.ChatDto;
using HealthCareDomain.Entity.Chat;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Contract.IService
{
    public interface IChatService
    {
        Task<ApiResponseDto> GetUserListAsync(string Id, string role);
        Task<ApiResponseDto> GetMessagesAsync(string senderId, string receiverId);

        Task <Message> SendMessageAsync(string senderId, string receiverId, string message, string base64data);

        //Task<ApiResponseDto> sendFileAsync(ForFileDto forFileDto, string senderId);
    }
}
