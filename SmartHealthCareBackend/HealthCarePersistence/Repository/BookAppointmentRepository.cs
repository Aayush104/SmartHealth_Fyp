using HealthCareDomain.Entity.Appointment;
using HealthCareDomain.IRepository;
using HealthCarePersistence.DatabaseContext;
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

        public async Task<bool> BookAppointment(BookAppointment bookAppointment)
        {
            try
            {
               
                await _dbContext.BookAppointments.AddAsync(bookAppointment);

               
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
