using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Contracts.Email
{
    public interface IMailService
    {
        Task SendEmail(string toEmail, string fullName,  string Otp);
        Task SendDoctorAcceptanceEmail(string toEmail, string fullName, string Otp);
        Task SendDoctorRejectionEmail(string toEmail, string fullName);
        Task SendBookingConfirmationEmail(string toEmail, string fullName, string meetingId, string doctorName, DateTime appointmentDate, string startTime);
    }
}
