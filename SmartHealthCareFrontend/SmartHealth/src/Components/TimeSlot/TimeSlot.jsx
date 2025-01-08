// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import noDate from "../../Assets/Image/NoDate.png"

// const TimeSlot = ({ fee, Id }) => {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [groupedSlots, setGroupedSlots] = useState({});
//   const [currentIndex, setCurrentIndex] = useState(0); // Track the current index for the visible dates

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`https://localhost:7070/api/Doctor/GetDoctorAvailability/${Id}`);
//         const data = response.data.$values;

//         // Group slots by date dynamically
//         const slotsByDate = {};

//         data.forEach(item => {
//           item.timeSlots.$values.forEach(slot => {
//             if (!slotsByDate[slot.date]) {
//               slotsByDate[slot.date] = [];
//             }
//             slotsByDate[slot.date].push(slot);
//           });
//         });

//         setGroupedSlots(slotsByDate);

//         // Set the initial selected date to 'Today' if available, otherwise fallback to the first available date
//         const today = new Date().toISOString().split('T')[0];
//         if (slotsByDate[today]) {
//           setSelectedDate(today);
//           setAvailableSlots(slotsByDate[today]);
//         } else {
//           const firstDate = Object.keys(slotsByDate)[0];
//           setSelectedDate(firstDate);
//           setAvailableSlots(slotsByDate[firstDate]);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [Id]);

//   // Helper function to format the date with special labels for "Today" and "Tomorrow"
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const today = new Date();
//     const tomorrow = new Date();
//     tomorrow.setDate(today.getDate() + 1);

//     if (date.toISOString().split('T')[0] === today.toISOString().split('T')[0]) {
//       return 'Today';
//     } else if (date.toISOString().split('T')[0] === tomorrow.toISOString().split('T')[0]) {
//       return 'Tomorrow';
//     } else {
//       return date.toLocaleDateString(); // Format as you wish
//     }
//   };

//   // Sort available slots to display today's slots first
//   const sortedSlots = availableSlots.sort((a, b) => {
//     const today = new Date().toISOString().split('T')[0];
//     const aDate = new Date(a.date).toISOString().split('T')[0];
//     const bDate = new Date(b.date).toISOString().split('T')[0];

//     // If today is selected, make sure today’s slots come first
//     if (aDate === today) return -1;
//     if (bDate === today) return 1;

//     return a.startTime.localeCompare(b.startTime); // Sort by start time for other slots
//   });

//   // Get the list of dates
//   const dates = Object.keys(groupedSlots);

//   // Sort the dates to make sure "Today" comes first
//   const sortedDates = dates.sort((a, b) => {
//     const today = new Date().toISOString().split('T')[0];
//     if (a === today) return -1;
//     if (b === today) return 1;
//     return new Date(a) - new Date(b);
//   });

//   // Slice the dates to show only 3 at a time
//   const visibleDates = sortedDates.slice(currentIndex, currentIndex + 3);

//   // Handle next and previous buttons for scrolling
//   const goToNext = () => {
//     if (currentIndex + 3 < sortedDates.length) {
//       setCurrentIndex(currentIndex + 3);
//     }
//   };

//   const goToPrevious = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 3);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm p-8">
//       {/* Header */}
//       <div className="p-4 bg-blue-50 rounded-t-lg">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-blue-100 rounded-full">
//             <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
//               <path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V8h14v12z" stroke="currentColor" strokeWidth="2"/>
//             </svg>
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold">Video Consultation</h2>
//             <p className="text-sm text-gray-600">₹ {fee} fee</p>
//           </div>
//         </div>
//       </div>

//       {/* Date Selector */}
//       <div className="relative flex items-center mb-6">
//         <button onClick={goToPrevious} className="p-1 hover:bg-gray-100 rounded-full">
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>

//         <div className="flex-1 flex justify-between px-4 overflow-hidden">
//           {visibleDates.map((date) => (
//             <button
//               key={date}
//               onClick={() => {
//                 setSelectedDate(date);
//                 setAvailableSlots(groupedSlots[date]);
//               }}
//               className={`flex-1 py-2 text-center border-b-2 ${selectedDate === date ? 'border-blue-500 text-blue-500' : 'border-transparent'}`}
//             >
//               <div className="font-medium">{formatDate(date)}</div>
//               <div className="text-sm text-green-600">{groupedSlots[date].length} Slots Available</div>
//             </button>
//           ))}
//         </div>

//         <button onClick={goToNext} className="p-1 hover:bg-gray-100 rounded-full">
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//           </svg>
//         </button>
//       </div>

//       {/* Time Slots */}
//       <div className="space-y-6 ">
//         {sortedSlots.length ? (
//           <div className='flex flex-wrap gap-3 px-8'>
//             {sortedSlots.map((slot) => (
//               <button
//                 key={slot.startTime}
//                 onClick={() => setSelectedSlot(slot.startTime)}
//                 className={`p-2 text-sm border rounded ${selectedSlot === slot.startTime ? 'border-blue-500 text-blue-500' : 'border-gray-200 hover:border-blue-500'}`}
//               >
//                 {slot.startTime} - {slot.endTime}
//               </button>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center">
//             <img src={noDate} alt="No slots available" className="mx-auto mb-2"/>
//             <span className="text-sm text-gray-500">No available slots</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TimeSlot;

import axios from "axios";
import React, { useEffect, useState } from "react";
import noDate from "../../Assets/Image/NoDate.png";

const TimeSlot = ({ fee, Id }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [groupedSlots, setGroupedSlots] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7070/api/Doctor/GetDoctorAvailability/${Id}`
        );

        console.log("Response", response);
        const data = response.data.$values;

        const slotsByDate = {};

        data.forEach((item) => {
          item.timeSlots.$values.forEach((slot) => {
            if (!slotsByDate[slot.date]) {
              slotsByDate[slot.date] = [];
            }
            slotsByDate[slot.date].push(slot);
          });
        });

        setGroupedSlots(slotsByDate);

        const today = new Date().toISOString().split("T")[0];
        if (slotsByDate[today]) {
          setSelectedDate(today);
          setAvailableSlots(slotsByDate[today]);
        } else {
          const firstDate = Object.keys(slotsByDate)[0];
          setSelectedDate(firstDate);
          setAvailableSlots(slotsByDate[firstDate]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [Id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toISOString().split("T")[0] === today.toISOString().split("T")[0]) {
      return "Today";
    } else if (
      date.toISOString().split("T")[0] === tomorrow.toISOString().split("T")[0]
    ) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString();
    }
  };

  const dates = Object.keys(groupedSlots);

  const sortedDates = dates.sort((a, b) => {
    const today = new Date().toISOString().split("T")[0];
    if (a === today) return -1;
    if (b === today) return 1;
    return new Date(a) - new Date(b);
  });

  const visibleDates = sortedDates.slice(currentIndex, currentIndex + 3);

  const goToNext = () => {
    if (currentIndex + 3 < sortedDates.length) {
      setCurrentIndex(currentIndex + 3);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 3);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm p-8">
      <div className="p-4 bg-blue-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V8h14v12z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Video Consultation</h2>
            <p className="text-sm text-gray-600">₹ {fee} fee</p>
          </div>
        </div>
      </div>

      <div className="relative flex items-center mb-6">
        <button onClick={goToPrevious} className="p-1 hover:bg-gray-100 rounded-full">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex-1 flex justify-between px-4 overflow-hidden">
          {visibleDates.map((date) => (
            <button
              key={date}
              onClick={() => {
                setSelectedDate(date);
                setAvailableSlots(groupedSlots[date]);
              }}
              className={`flex-1 py-2 text-center border-b-2 ${
                selectedDate === date ? "border-blue-500 text-blue-500" : "border-transparent"
              }`}
            >
              <div className="font-medium">{formatDate(date)}</div>
              <div className="text-sm text-green-600">
                {groupedSlots[date].length} Slots Available
              </div>
            </button>
          ))}
        </div>

        <button onClick={goToNext} className="p-1 hover:bg-gray-100 rounded-full">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        {availableSlots.length ? (
          <div className="flex flex-wrap gap-3 px-8">
            {availableSlots.map((slot) => (
              <button
                key={slot.startTime}
                onClick={() => setSelectedSlot(slot.startTime)}
                className={`p-2 text-sm border rounded ${
                  selectedSlot === slot.startTime
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-200 hover:border-blue-500"
                }`}
              >
                {slot.startTime} - {slot.endTime}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <img src={noDate} alt="No slots available" className="mx-auto mb-2 h-20 w-20" />
            <span className="text-md text-gray-500">No available slots</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlot;
