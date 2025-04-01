import React from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoMdMail } from "react-icons/io";
import { FaClipboardList } from "react-icons/fa";
import { BiMessageSquareDetail } from "react-icons/bi";
import { RiUserFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { MdBroadcastOnPersonal } from "react-icons/md";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="h-screen w-16 sm:w-56 bg-sky-700 text-white shadow-lg fixed transition-all duration-300 z-10">
      <div className="p-3 flex flex-col justify-between h-full">
        <ul className="space-y-6 w-full">
          <li
            onClick={() => handleNavigation("/admin/dashboard")}
            className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 hover:bg-sky-600 p-3 rounded-md transition-colors duration-200 cursor-pointer"
            title="Dashboard"
          >
            <AiOutlineDashboard className="text-xl" />
            <span className="text-sm sm:text-md hidden sm:inline">Dashboard</span>
          </li>
          <li
            onClick={() => handleNavigation("/admin/users")}
            className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 hover:bg-sky-600 p-3 rounded-md transition-colors duration-200 cursor-pointer"
            title="Messages"
          >
            <FaUsers className="text-xl" />
            <span className="text-sm sm:text-md hidden sm:inline">Users</span>
          </li>
          <li
            onClick={() => handleNavigation("/admin/bookings")}
            className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 hover:bg-sky-600 p-3 rounded-md transition-colors duration-200 cursor-pointer"
            title="Bookings"
          >
            <FaClipboardList className="text-xl" />
            <span className="text-sm sm:text-md hidden sm:inline">Bookings</span>
          </li>
          <li
            onClick={() => handleNavigation("/admin/broadcast")}
            className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 hover:bg-sky-600 p-3 rounded-md transition-colors duration-200 cursor-pointer"
            title="Review"
          >
            <MdBroadcastOnPersonal className="text-xl" />
            <span className="text-sm sm:text-md hidden sm:inline">Announcement</span>
          </li>
          <li
            onClick={() => handleNavigation("/admin/feedback")}
            className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 hover:bg-sky-600 p-3 rounded-md transition-colors duration-200 cursor-pointer"
            title="Profile"
          >
            <RiUserFill className="text-xl" />
            <span className="text-sm sm:text-md hidden sm:inline">FeedBacks</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
