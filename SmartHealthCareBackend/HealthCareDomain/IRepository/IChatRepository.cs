using HealthCareApplication.Dtos.ChatDto;
using HealthCareDomain.Entity.UserEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareDomain.IRepository
{
    public interface IChatRepository
    {
        Task <List<UserListDto>> GetPatientListAsync(string userId);
        Task <List<UserListDto>> GetDoctorListAsync(string userId);
    }
}
