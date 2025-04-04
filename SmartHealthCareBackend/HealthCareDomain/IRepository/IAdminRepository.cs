using HealthCareApplication.Dtos.AdminDto;
using HealthCareDomain.Contract.ContractDto.AdminDto;
using HealthCareDomain.Entity.Announcement;
using HealthCareDomain.Entity.Doctors;
using HealthCareDomain.Entity.Patients;
using HealthCareDomain.Entity.Reporting;
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
        Task<IEnumerable<ReportListDto>> GetAllReportsAsync();
        Task<bool> BlockUserAsync(string Id);
        Task<bool> UnBlockUserAsync(string Id);
        Task<bool> DeleteCommentAsync(int Id);

        Task<List<Announce>> GetAllNotificationAsync();

        Task DoAnnounceAsync(Announce announce);

        Task<bool> UpdateNotificationStatus();

        Task DoReportAsync(Report report);

    }
}