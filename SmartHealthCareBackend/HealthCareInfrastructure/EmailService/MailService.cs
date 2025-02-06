using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using HealthCareApplication.Contracts.Email;
using static System.Net.WebRequestMethods;

namespace HealthCareApplication.Features.Services
{
    public class MailService : IMailService
    {
        private readonly SmtpClient _smtpClient;
        private readonly string _fromEmail;

        public MailService()
        {
            
            _smtpClient = new SmtpClient
            {
                Host = Environment.GetEnvironmentVariable("SMTP_HOST") ?? throw new InvalidOperationException("SMTP_HOST is not set"),
                Port = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT") ?? throw new InvalidOperationException("SMTP_PORT is not set")),
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(
                    Environment.GetEnvironmentVariable("SMTP_USERNAME") ?? throw new InvalidOperationException("SMTP_USERNAME is not set"),
                    Environment.GetEnvironmentVariable("SMTP_PASSWORD") ?? throw new InvalidOperationException("SMTP_PASSWORD is not set")),
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network
            };

            _fromEmail = Environment.GetEnvironmentVariable("FROM_EMAIL") ?? throw new InvalidOperationException("FROM_EMAIL is not set");
        }

        public async Task SendBookingConfirmationEmail(
        string toEmail,
        string fullName,
        string meetingId,
        string doctorName,
        DateTime appointmentDate,
        string startTime)
        {
            var body = $@"
<html>
    <body style='font-family: Arial, sans-serif;'>
        <p>Dear <strong>{fullName}</strong>,</p>
        <p>You have booked an appointment with <strong>Dr.{doctorName}</strong> 
        on <strong>{appointmentDate:MMMM dd, yyyy}</strong> at <strong>{startTime}</strong>.</p>
        
        <p>If you have any further questions, feel free to contact our support team.</p>
        <p>Thank you for booking through <strong>Smart Health</strong>.</p>
        <br/>
        <p>Best regards,<br/>
        <strong>Smart Health Team</strong></p>
    </body>
</html>";

            var message = new MailMessage
            {
                From = new MailAddress(_fromEmail),
                Subject = "Booking Confirmation Email",
                Body = body,
                IsBodyHtml = true
            };

            message.To.Add(toEmail);

            try
            {
                await _smtpClient.SendMailAsync(message);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Error sending email", ex);
            }
            finally
            {
                message.Dispose();
            }
        }
        public async Task SendDoctorAcceptanceEmail(string toEmail, string fullName, string otp)
        {

            var body = $@"
    <html>
        <body>
            <p>Dear <strong>{fullName}</strong>,</p>
            <p>Thank you for registering with SmartHealthAppointment. You have received this email because this email address was used during registration. 
            If you did not register for our service, please disregard this email. You do not need to unsubscribe or take any further action.</p>
            
            <strong>Account Activation Instructions</strong>
            <p>We require that you verify your email to ensure that the email address you entered was correct. 
            To verify your email, simply click  <a href='http://localhost:5173/ConfirmEmail/{toEmail}/{otp}'>here</a>.</p>

            <p>Regards,<br/>
            Smart Health Team</p>
        </body>
    </html>";

            var message = new MailMessage
            {
                From = new MailAddress(_fromEmail),
                Subject = "Verify User Email",
                Body = body,
                IsBodyHtml = true
            };

             message.To.Add(toEmail);

            try
            {
                await _smtpClient.SendMailAsync(message);

            }
            catch (Exception ex)
            {

                throw new InvalidOperationException("Error sending email", ex);
            }
            finally
            {

                message.Dispose();
            }
        }



        public async Task SendDoctorRejectionEmail(string toEmail, string fullName)
        {
            var body = $@"
<html>
    <body>
        <p>Dear <strong>{fullName}</strong>,</p>
        <p>We regret to inform you that after carefully reviewing your submitted documents, we are unable to approve your registration as a doctor on our platform at this time. If there was any mistake or missing information in your submission, we encourage you to provide the correct documentation and reapply.</p>
        <p>If you have any further questions, feel free to contact our support team.</p>
        <p>Thank you for your interest in Smart Health.</p>
        <br/>
        <p>Best regards,<br/>
        Smart Health Team</p>
    </body>
</html>";

            var message = new MailMessage
            {
                From = new MailAddress(_fromEmail),
                Subject = "Doctor Registration Update",
                Body = body,
                IsBodyHtml = true
            };

            message.To.Add(toEmail);

            try
            {
                await _smtpClient.SendMailAsync(message);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Error sending email", ex);
            }
            finally
            {
                message.Dispose();
            }
        }


        public async Task SendEmail(string toEmail, string fullName, string otp)
        {

            var body = $"<html><body><p>Hello {fullName},</p><p>Your OTP for verification is: <strong>{otp}</strong></p></body></html>";

            var message = new MailMessage
            {
                From = new MailAddress(_fromEmail),
                Subject = "Smart Health OTP",
                Body = body,
                IsBodyHtml = true
            };

            message.To.Add(toEmail);

            try
            {
                await _smtpClient.SendMailAsync(message);
               
            }
            catch (Exception ex)
            {

                throw new InvalidOperationException("Error sending email", ex);
            }
            finally
            {
                
                message.Dispose();
            }
        }
    }
}
