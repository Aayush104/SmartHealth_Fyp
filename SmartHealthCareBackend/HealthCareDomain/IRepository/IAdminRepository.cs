﻿using HealthCareApplication.Dtos.AdminDto;
using HealthCareDomain.Contract.ContractDto.AdminDto;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Patients;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.IRepository
{
    public interface IAdminRepository
    {
        Task<IEnumerable<PatientListDto>> GetPatient();
        Task<IEnumerable<Doctor>> GetAllDoctors();
        Task<IEnumerable<BookingListDto>> GetAllAppointments();
        Task<bool> BlockUserAsync(string Id);
        Task<bool> UnBlockUserAsync(string Id);



        
    }
}