
using HealthCareDomain.Contract.ContractDto.DoctorRevenue;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Review;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCarePersistence.IRepository
{
    public interface IDoctorRepository
    {
        Task AddDoctor(Doctor doctor);
        Task<IEnumerable<Doctor>> GetAllDoctors();

        Task <Doctor> GetDoctorBYId(string userId);
        Task  UpdateDoctorAsync(Doctor doctor);

        Task<List<DoctorAdditionalInfo>> GetByUserIdFromAdditionalAsync(string userId);
        Task UpdateAdditionalAsync(DoctorAdditionalInfo info);
        Task<IEnumerable<Doctor>> SearchDoctors(string speciality, string Location);
        Task AddAdditionalInfoAsync(DoctorAdditionalInfo info);

        Task AddComment(Comments comments);
        Task AddReply(Reply reply);

        Task<List<Comments>> GetCommentsAsync(string userId);
        Task<List<Reply>> GetReplyAsync(int CommentId);



        Task <List<DoctorRevenue>> DoctorRevenuesById(string id);

    }

}
