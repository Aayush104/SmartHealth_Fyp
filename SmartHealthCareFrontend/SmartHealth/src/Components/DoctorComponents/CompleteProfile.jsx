import React, { useState } from 'react';
import { AiFillFileAdd } from 'react-icons/ai';
import { RxCross2 } from "react-icons/rx";
import { motion } from 'framer-motion';

const CompleteProfile = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file)); // Create a preview URL for the file
  };

  return (
    <div className=" fixed top-0 left-0 w-full h-[45rem] bg-gray-900 bg-opacity-50 z-40 flex justify-center items-center">
      <motion.div
        className=" bg-white shadow-md rounded w-full max-w-xl p-6 relative"
        initial={{ y: "100%" }}
        animate={{ y: 0 }} 
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="absolute top-2 right-2 cursor-pointer" onClick={onClose}>
          <RxCross2 className="text-gray-500 text-2xl" />
        </div>

        <p className="text-lg font-semibold text-gray-500">Smart Health</p>
        <p className="text-[15px] text-blue-400 mb-4">Add Your Details</p>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="mb-4 w-full">
              <label className="text-gray-700 text-sm mb-2" htmlFor="experience">
                Experience
              </label>
              <input
                id="experience"
                type="text"
                placeholder="Enter your experience"
                required
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 w-full">
              <label className="text-gray-700 text-sm mb-2" htmlFor="fee">
                Consultation Fee
              </label>
              <input
                id="fee"
                type="number"
                placeholder="Enter your fee"
                required
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 w-full">
            <div className="mb-4 w-full">
              <label className="text-gray-700 text-sm mb-2" htmlFor="availableDays">
                Available Days
              </label>
              <input
                id="availableDays"
                type="text"
                placeholder="Enter available days"
                required
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 w-full">
              <label className="text-gray-700 text-sm mb-2" htmlFor="availableTime">
                Available Time
              </label>
              <input
                id="availableTime"
                type="text"
                placeholder="Enter available time"
                required
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4 w-full flex flex-col gap-2">
            <label className="text-gray-700 text-sm mb-2" htmlFor="Profile">
              Add Profile<span className="text-red-500">*</span>
            </label>
            <div className='flex gap-2'>
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

          <div className="mb-4 w-full">
            <label className="text-gray-700 text-sm mb-2" htmlFor="description">
              Description <span className="text-red-500">(optional)</span>
            </label>
            <textarea
              id="description"
              placeholder="Add your description"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
