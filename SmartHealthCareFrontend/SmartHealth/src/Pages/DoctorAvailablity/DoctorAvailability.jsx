import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion"; 

const DoctorAvailability = ({ onClose }) => {
  const [availabilities, setAvailabilities] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotDuration, setSlotDuration] = useState("20"); 
  const [date, setDate] = useState("");

  const token = Cookies.get("Token");
  const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : {};
  const doctorId = decodedToken.userId || "Doctor";

 
  const handleAddAvailability = () => {
    if (!startTime || !endTime || !date) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Add the new time slot to the availabilities state
    setAvailabilities((prev) => [
      ...prev,
      { date, timeSlots: [{ startTime, endTime, slotDuration: parseInt(slotDuration) }] },
    ]);

    // Clear the input fields for next entry
    setStartTime("");
    setEndTime("");
    setSlotDuration("20");
    setDate("");
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (availabilities.length === 0) {
      toast.error("Please add at least one date with time slots.");
      return;
    }
    if (!doctorId) {
      toast.error("Doctor ID is missing. Please log in again.");
      return;
    }

    try {
      // Prepare the payload with the correct structure
      const payload = {
        doctorId: doctorId, // Add doctorId here
        timeSlots: availabilities.flatMap((availability) =>
          availability.timeSlots.map((slot) => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
            date: availability.date, // Include the date for each time slot
            slotDuration: slot.slotDuration,
          }))
        ),
      };

      console.log(payload); // Optional: Check the structure in the console

      // Send the payload to the backend
      const response = await axios.post(
        "https://localhost:7070/api/Doctor/GenerateAvailability", // Adjust URL accordingly
        payload
      );

      toast.success("Availability saved successfully!");
      setAvailabilities([]); // Clear the added availabilities
      onClose(); // Close the modal or perform any other closing action
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error("Failed to save availability. Please try again.");
    }
  };

  // Check if any input fields (except duration) have data
  const isFormInvalid = startTime || endTime || date;

  return (
    <div className="fixed top-0 left-0 w-full h-[55rem] bg-gray-900 bg-opacity-50 z-40 flex justify-center items-center">
      <motion.div
        className="bg-white shadow-md rounded w-full max-w-xl p-6 relative"
        initial={{ opacity: 0, y: -100 }} // Initial state (invisible and above)
        animate={{ opacity: 1, y: 0 }} // Animate to visible and centered
        transition={{ duration: 0.3 }} // Duration of the animation
      >
        <div className="absolute top-2 right-2 cursor-pointer" onClick={onClose}>
          <span className="text-gray-500 text-2xl">X</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-semibold text-gray-500">Doctor Availability</p>
          <p className="text-[15px] text-blue-400">Add Availability</p>
        </div>
        <div className="border"></div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time:</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Time:</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Slot Duration (minutes):</label>
            <input
              type="number"
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              min="10"
              max="60"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={handleAddAvailability}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Add Availability
          </button>

         
          <div>
          <h3 className="text-lg font-medium">Added Availabilities</h3>
          <div className="flex">
                      {availabilities.length > 0 ? (
              availabilities.map((availability, index) => (
                <div key={index} className="mt-3">
                  <strong className="text-sm">Date:</strong> {availability.date}
                  <ul className="mt-2 pl-5 space-y-1">
                    {availability.timeSlots.map((slot, idx) => (
                      <li key={idx} className="text-sm">
                        {slot.startTime} - {slot.endTime} | Duration: {slot.slotDuration} minutes
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>No availabilities added yet.</p>
            )}
            </div>

          </div>

          <button
            type="submit"
            className={`w-full py-2 ${isFormInvalid ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-400 hover:bg-sky-500'} text-white rounded-md transition`}
            disabled={isFormInvalid}
          >
            Submit Availability
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default DoctorAvailability;
