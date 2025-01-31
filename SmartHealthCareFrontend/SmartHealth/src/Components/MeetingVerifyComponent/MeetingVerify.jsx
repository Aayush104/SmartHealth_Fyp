import React, { useState } from 'react'
import Cookies from 'js-cookie';
import { RxCross2 } from 'react-icons/rx';
import axios from 'axios';
import { motion } from 'framer-motion'

const MeetingVerify = ({ onClose }) => {
const [meetingId, setMeetingId] = useState('');

const handleSubmit = (e)=>
{
    e.preventDefault();
    console.log("Hello")
}


  return (
    <div className="fixed top-0 left-0 w-full h-[60rem] bg-gray-900 bg-opacity-50 z-40 flex justify-center items-center">
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
        <p className="text-[15px] text-blue-400">Join Meeting for Consultant</p>
      </div>
      <div className="border"></div>

      <form className="flex flex-wrap mt-2" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between gap-4 w-full">
          <div className='w-full'> 
            <div className="mb-4 w-full ">
              <label className="text-gray-700 text-md mb-2" htmlFor="address">
           Meeting Address
              </label>
              <input
                id="address"
                type="text"
                placeholder="Enter You Meeting Address"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 mt-1  text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
          </div>
        </div>

        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">
         Join Meeting
        </button>
      </form>
    </motion.div>
  </div>
  )
}

export default MeetingVerify
