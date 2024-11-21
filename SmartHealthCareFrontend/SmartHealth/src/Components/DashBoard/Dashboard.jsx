import React from 'react';
import { AiOutlineDashboard } from "react-icons/ai";
import { IoMdMail } from "react-icons/io";
import { FaClipboardList } from "react-icons/fa";
import { BiMessageSquareDetail } from "react-icons/bi";
import { RiUserFill } from "react-icons/ri";

const Dashboard = () => {
  return (
    <div className="w-60 h-screen bg-sky-700 text-white shadow-lg fixed">
      <div className="p-2">
      
        <ul className="space-y-6">
      
          <li className="flex items-center space-x-2 hover:bg-sky-600 p-3 rounded-md transition-colors duration-200 cursor-pointer">
            <AiOutlineDashboard className="text-xl" />
            <span className="text-md">Dashboard</span>
          </li>
          
      
          <li className="flex items-center space-x-2 hover:bg-sky-600 p-3 rounded-md transition-colors duration-200 cursor-pointer">
            <IoMdMail className="text-xl" />
            <span className="text-md">Messages</span>
          </li>
          
      
          <li className="flex items-center space-x-2 hover:bg-sky-600 p-3 rounded-md transition-colors duration-200 cursor-pointer">
            <FaClipboardList className="text-xl" />
            <span className="text-md">Bookings</span>
          </li>
          
       
          <li className="flex items-center space-x-2 hover:bg-sky-600 p-3 rounded-md transition-colors duration-200 cursor-pointer">
            <BiMessageSquareDetail className="text-xl" />
            <span className="text-md">Review</span>
          </li>
          
     
          <li className="flex items-center space-x-2 hover:bg-sky-600 p-3 rounded-md transition-colors duration-200 cursor-pointer">
            <RiUserFill className="text-xl" />
            <span className="text-md">Profile</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
