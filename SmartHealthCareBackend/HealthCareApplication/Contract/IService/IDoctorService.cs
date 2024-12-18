﻿using HealthCareApplication.Dtos.UserDto;
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
        Task <IEnumerable<DoctorDetailsDto>> SearchDoctorAsync(SearchDto searchDto);
        Task<DoctorDetailsDto> GetDoctorDetails(string Id);
    }
}
