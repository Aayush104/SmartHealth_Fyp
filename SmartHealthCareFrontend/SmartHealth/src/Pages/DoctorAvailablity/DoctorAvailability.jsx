import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const DoctorAvailability = () => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [slotDuration, setSlotDuration] = useState('20');
  const [timeSlots, setTimeSlots] = useState([]);

  const token = Cookies.get("Token");
  const doctorId = token ? JSON.parse(atob(token.split('.')[1])).Id : null;

  const handleAddSlot = (e) => {
    e.preventDefault();

    if (!startTime || !endTime) {
      alert("Please provide both start and end times");
      return; 
    }

    // Validate time slot duration
    if (parseInt(slotDuration) < 10) {
      alert("Slot duration must be at least 10 minutes");
      return;
    }

    const newSlot = {
      startTime,
      endTime,
      slotDuration: parseInt(slotDuration)
    };

    setTimeSlots((prevSlots) => [...prevSlots, newSlot]);

    // Reset the input fields
    setStartTime('');
    setEndTime('');
    setSlotDuration('20'); 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || timeSlots.length === 0) {
      alert("Please select a date and add at least one time slot.");
      return;
    }

    try {
      const response = await axios.post("https://localhost:7070/api/Doctor/GenerateAvailability", {
        doctorId,
        date,
        timeSlots
      });

      console.log('Submitting availability data:', response.data);
      alert("Availability saved successfully!");
      // Optionally, clear the form after successful submission
      setDate('');
      setTimeSlots([]);
    } catch (error) {
      console.error('Error saving availability:', error);
      alert("Failed to save availability. Please try again.");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Set Your Availability</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Select Date</label>
          <input 
            type='date' 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full" 
          />
        </div>
        
        {/* Time Slot Input Fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Start Time</label>
          <input 
            type='time' 
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full" 
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">End Time</label>
          <input 
            type='time' 
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full" 
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Slot Duration (minutes)</label>
          <input 
            type='number' 
            min="10" 
            value={slotDuration}  
            onChange={(e) => setSlotDuration(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full" 
          />
        </div>

        <button 
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200" 
          onClick={handleAddSlot}
        >
          Add Time Slot
        </button>

        {/* Display Added Time Slots */}
        {timeSlots.length > 0 && (
          <div className="mb-4 mt-6">
            <h3 className="text-lg font-semibold mb-2">Added Time Slots</h3>
            <ul className="list-disc pl-5">
              {timeSlots.map((slot, index) => (
                <li key={index}>
                  {slot.startTime} - {slot.endTime} ({slot.slotDuration} mins)
                </li>
              ))}
            </ul>
          </div>
        )}

        <button 
          type="submit"
          className="w-full bg-cyan-500 mt-4 text-white p-2 rounded-md hover:bg-green-600 transition"
        >
          Save Availability
        </button>
      </form>
    </div>
  );
}

export default DoctorAvailability; 
