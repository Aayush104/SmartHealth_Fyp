import React, { useState } from 'react';
import { AiFillFileAdd } from 'react-icons/ai';
import { RxCross2 } from 'react-icons/rx';
import { motion } from 'framer-motion';
import Select from 'react-select'; 
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast
import Cookies from 'js-cookie';

const CompleteProfile = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [consultationFee, setConsultationFee] = useState('');
  const [availableTimeFrom, setAvailableTimeFrom] = useState('');
  const [availableTimeTo, setAvailableTimeTo] = useState('');
  const [availableFromDay, setAvailableFromDay] = useState('');
  const [availableToDay, setAvailableToDay] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');

  const token = Cookies.get("Token");

  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const userId = decodedToken.userId;

  
  const experienceRegex = /^(?:\d+)\s?(?:year|month)s?$/;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (experience && !experienceRegex.test(experience)) {
      toast.error('Please enter a valid experience in (e.g., "years" or "months").');
      return;
    }
    

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append('Profile', selectedFile);
    formData.append('Experience', experience);
    formData.append('FromDay', availableFromDay);
    formData.append('ToDay', availableToDay);
    formData.append('FromTime', availableTimeFrom);
    formData.append('ToTime', availableTimeTo);
    formData.append('Description', description);
    formData.append('Fee', consultationFee);

    try {
      const response = await axios.post("https://localhost:7070/api/Doctor/AddProfile", formData, {
    
      });


      if (response.status === 200) {
        toast.success('Profile added successfully!');
        onClose(); 
      }
    } catch (error) {
      toast.error('Error submitting profile. Please try again later.');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file)); 
  };

 

  const handleFeeChange = (event) => {
    setConsultationFee(event.target.value);
  };

  const handleAvailableTimeFromChange = (selectedOption) => {
    setAvailableTimeFrom(selectedOption.value);
  };

  const handleAvailableTimeToChange = (selectedOption) => {
    setAvailableTimeTo(selectedOption.value);
  };

  const handleAvailableFromDayChange = (event) => {
    setAvailableFromDay(event.target.value);
  };

  const handleAvailableToDayChange = (event) => {
    setAvailableToDay(event.target.value);
  };

  const timeOptions = [
    { value: '1:00 AM', label: '1:00 AM' },
    { value: '2:00 AM', label: '2:00 AM' },
    { value: '3:00 AM', label: '3:00 AM' },
    { value: '4:00 AM', label: '4:00 AM' },
    { value: '5:00 AM', label: '5:00 AM' },
    { value: '6:00 AM', label: '6:00 AM' },
    { value: '7:00 AM', label: '7:00 AM' },
    { value: '8:00 AM', label: '8:00 AM' },
    { value: '9:00 AM', label: '9:00 AM' },
    { value: '10:00 AM', label: '10:00 AM' },
    { value: '11:00 AM', label: '11:00 AM' },
    { value: '12:00 PM', label: '12:00 PM' },
    { value: '1:00 PM', label: '1:00 PM' },
    { value: '2:00 PM', label: '2:00 PM' },
    { value: '3:00 PM', label: '3:00 PM' },
    { value: '4:00 PM', label: '4:00 PM' },
    { value: '5:00 PM', label: '5:00 PM' },
    { value: '6:00 PM', label: '6:00 PM' },
    { value: '7:00 PM', label: '7:00 PM' },
    { value: '8:00 PM', label: '8:00 PM' },
    { value: '9:00 PM', label: '9:00 PM' },
    { value: '10:00 PM', label: '10:00 PM' },
    { value: '11:00 PM', label: '11:00 PM' },
    { value: '12:00 AM', label: '12:00 AM' }
  ];

  return (
    <div className="fixed top-0 left-0 w-full h-[55rem] bg-gray-900 bg-opacity-50 z-40 flex justify-center items-center">
      <motion.div
        className="bg-white shadow-md rounded w-full max-w-xl p-6 relative"
        initial={{ y: "100%" }}
        animate={{ y: 0 }} 
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="absolute top-2 right-2 cursor-pointer" onClick={onClose}>
          <RxCross2 className="text-gray-500 text-2xl" />
        </div>
        <div className='flex items-center justify-between mt-2'>
          <p className="text-lg font-semibold text-gray-500">Smart Health</p>
          <p className="text-[15px] text-blue-400">Add Your Details</p>
        </div>
        <div className='border'></div>

        <form className="flex flex-wrap mt-2" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="mb-4 w-full"> 
              <label className="text-gray-700 text-sm mb-2" htmlFor="experience">
                Experience
              </label>
              <input
                id="experience"
                type="text"
                placeholder="Enter your experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 w-full">
              <label className="text-gray-700 text-sm mb-2" htmlFor="fee">
                Consultation Fee
              </label>
              <select
                id="fee"
                value={consultationFee}
                onChange={handleFeeChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select fee</option>
                <option value="300">300</option>
                <option value="500">500</option>
                <option value="800">800</option>
                <option value="1000">1000</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 w-full">
            <div className="mb-4 w-full">
              <label className="text-gray-700 text-sm mb-2" htmlFor="availableDays">
                Available Days
              </label>
              <div className='flex gap-4 '>
                <select
                  id="availableFrom"
                  value={availableFromDay}
                  onChange={handleAvailableFromDayChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>From Day</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
                <p className='mt-2'>To</p>
                <select
                  id="availableTo"
                  value={availableToDay}
                  onChange={handleAvailableToDayChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>To Day</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4 w-full">
            <label className="text-gray-700 text-sm mb-2" htmlFor="availableTime">
              Available Time
            </label>
            <div className="flex gap-4">
              <Select
                options={timeOptions}
                value={timeOptions.find(option => option.value === availableTimeFrom)}
                onChange={handleAvailableTimeFromChange}
                placeholder="From Time"
                className="w-full"
              />

              <p className='mt-2'>To</p>
              <Select
                options={timeOptions}
                value={timeOptions.find(option => option.value === availableTimeTo)}
                onChange={handleAvailableTimeToChange}
                placeholder="To Time"
                className="w-full"
              />
            </div>
          </div>

          <div className="mb-3 w-full">
            <label className="text-gray-700 text-sm mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter a brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
            />
          </div>

          <div className="mb-4 w-full">
          <label className="text-gray-700 text-sm" htmlFor="Add profile">
                Add Profile
              </label>
            <div className="flex  items-center gap-4">
            <label className="inline-flex items-center cursor-pointer border bg-sky-500 text-white py-2 px-4 rounded h-12">
                <AiFillFileAdd className="mr-2 text-lg" />
                <span>Choose file</span>
                <input
                  id="governmentId"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {filePreview && (
               <img src={filePreview} alt="File preview" className="h-20 object-contain" />
              
              )}
            </div>
          </div>

          <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">
            Submit Profile
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
