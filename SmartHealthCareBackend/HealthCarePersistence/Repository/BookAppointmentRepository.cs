using HealthCareDomain.Contract.ContractDto.NewFolder;
using HealthCareDomain.Contract.ContractDto.UserLIstForAppointment;
using HealthCareDomain.Entity.Appointment;
using HealthCareDomain.IRepository;
using HealthCarePersistence.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using Sprache;
using System;

using System.Threading.Tasks;

namespace HealthCarePersistence.Repository
{
    public class BookAppointmentRepository : IBookAppointmentRepository
    {
        private readonly AppDbContext _dbContext;

        public BookAppointmentRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<int> BookAppointment(BookAppointment bookAppointment)
        {
            try
            {

                await _dbContext.BookAppointments.AddAsync(bookAppointment);


                await _dbContext.SaveChangesAsync();

                return bookAppointment.Id;
            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error occurred while booking the appointment: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> CheckIds(string MeetingId)
        {
            try
            {
                var result = await _dbContext.BookAppointments
                    .AnyAsync(x => x.MeetingId == MeetingId && x.MeetingIdValidation == true);

                return result;
            }
            catch (Exception ex)
            {
                
                Console.WriteLine($"Error checking MeetingId: {ex.Message}");

           
                return false;
            }
        }



        public async Task<List<GetDoctorByIdDto>> GetDoctorListByIdAsync(string Id)
        {
           

            var result = await _dbContext.BookAppointments
                .Where(x => x.PatientId == Id)
                .Include(x => x.Doctor)
                .ThenInclude(doctor => doctor.User)
                .Select(appointment => new GetDoctorByIdDto
                {
                    AppointmentId = appointment.Id,
                    DoctorId = appointment.DoctorId,
                    DoctorName = appointment.Doctor.User.FullName,
                    AppointmentDate = appointment.AppointmentDate,
                    Slot = appointment.Slot,
                    MeetingId = appointment.MeetingId,
                    EndTime = appointment.EndTime!,
                    DoctorProfile = appointment.Doctor.Profile,
                    IsButtonEnabled = appointment.IsButtonEnabled,
                })
                .ToListAsync();

           
           

            return result;
        }


        public async Task<List<GetListById>> GetListByIdAsync(string Id)
        {
         

           
            var result = await _dbContext.BookAppointments
                .Where(x => x.DoctorId == Id)
                .Include(x => x.Patient)
                .ThenInclude(patient => patient.User)
                .Select(appointment => new GetListById
                {
                    AppointmentId = appointment.Id,
                    PatientFullName = appointment.Patient.User.FullName,
                    AppointmentDate = appointment.AppointmentDate,
                    Slot = appointment.Slot,
                    EndTime = appointment.EndTime!,
                    Status = appointment.Status,
                    PaymentStatus = appointment.PaymentStatus,
                    MeetingId = appointment.MeetingId,
                    IsButtonEnabled = appointment.IsButtonEnabled,
                })
                .ToListAsync();

       
       
          

            return result;
        }


        public async Task<List<BookAppointment>> GetUpcomingAppointments()
        {
            return await _dbContext.BookAppointments
                .Where(a => a.AppointmentDate.Date >= DateTime.UtcNow.Date)
                .OrderBy(a => a.AppointmentDate)
                .ThenBy(a => a.Slot)
                .ToListAsync();
        }

        public async Task<bool> Paymentasync(Payment payment)
        {
            try
            {

                await _dbContext.Payments.AddAsync(payment);


                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error occurred while booking the appointment: {ex.Message}");
                return false;
            }
        }

        public async Task UpdateAppointmentStatus(int appointmentId, bool MeetingIdValidation, bool isEnabled)
        {
            var appointment = await _dbContext.BookAppointments.FindAsync(appointmentId);
            if (appointment != null)
            {
                appointment.IsButtonEnabled = isEnabled;
                appointment.MeetingIdValidation = MeetingIdValidation;
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
