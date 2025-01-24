import React, { useState } from 'react';
import { toast } from 'react-toastify'; // Import toast
import Cookies from 'js-cookie';
import { RxCross2 } from 'react-icons/rx';
import axios from 'axios';
import { motion } from 'framer-motion';

const PersonalDetailsForm = ({ onClose }) => {
  const token = Cookies.get('Token');
  
  // State hooks for form input values
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const formData = {
      address,
      gender,
      phoneNumber,
    };

    try {
      const response = await axios.post('https://localhost:7070/api/Patient/AddPatientDetails', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("personal details", response)
      if (response.status === 200) {
        toast.success('Profile updated successfully!');
        
        onClose(); 
        window.location.reload();
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred while updating the profile');
      console.error(error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-[55rem] bg-gray-900 bg-opacity-50 z-40 flex justify-center items-center">
      <motion.div
        className="bg-white shadow-md rounded w-full max-w-xl p-6 relative"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="absolute top-2 right-2 cursor-pointer" onClick={onClose}>
          <RxCross2 className="text-gray-500 text-2xl" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-semibold text-gray-500">Smart Health</p>
          <p className="text-[15px] text-blue-400">Add Your Details</p>
        </div>
        <div className="border"></div>

        <form className="flex flex-wrap mt-2" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between gap-4 w-full">
            <div className='w-full'> 
              <div className="mb-4 w-full ">
                <label className="text-gray-700 text-sm mb-2" htmlFor="address">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="Enter your Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="shadow border rounded w-full py-2 px-3 mt-1  text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4 w-full">
                <label className="text-gray-700 text-sm mb-2" htmlFor="gender">
                  Gender
                </label>
                <input
                  id="gender"
                  type="text"
                  placeholder="Enter your Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="shadow border rounded w-full py-2 px-3 mt-1  text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4 w-full">
                <label className="text-gray-700 text-sm mb-2" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="text"
                  placeholder="Enter your Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="shadow border rounded w-full py-2 px-3 mt-1  text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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

export default PersonalDetailsForm;
