using HealthCareDomain.Contract.ContractDto;
using HealthCareDomain.Entity.Appointment;
using HealthCareDomain.IRepository;
using HealthCarePersistence.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Data.Entity;
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

        public async Task<IAsyncEnumerable<BookAppointment>> GetListByIdAsync(string Id)
        
{
            return _dbContext.BookAppointments
                             .Where(x => x.DoctorId == Id)
                       
                             .AsAsyncEnumerable();
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
    }
}
