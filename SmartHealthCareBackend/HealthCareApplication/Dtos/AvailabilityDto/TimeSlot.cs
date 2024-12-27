using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthCareApplication.Dtos.AvailabilityDto
{
    public class TimeSlot
    {
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Date { get; set; }
        public int SlotDuration { get; set; }
    }
}
