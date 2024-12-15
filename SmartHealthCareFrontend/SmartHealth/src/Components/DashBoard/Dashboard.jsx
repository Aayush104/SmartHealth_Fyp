import React from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoMdMail } from "react-icons/io";
import { FaClipboardList } from "react-icons/fa";
import { BiMessageSquareDetail } from "react-icons/bi";
import { RiUserFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="h-screen w-56 bg-sky-700 text-white shadow-lg fixed transition-all duration-300 z-10">
      <div className="p-3 flex flex-col justify-between h-full">
        <ul className="space-y-6 w-full">
          <li
            onClick={() => handleNavigation("/admin/dashboard")}
            className="flex items-center space-x-2 hover:bg-sky-600 p-3 rounded-md transition-colors duration-200 cursor-pointer"
            title="Dashboard"
          >
            <AiOutlineDashboard className="text-xl" />
            <span className="text-md">Dashboard</span>
          </li>
          <li
            onClick={() => handleNavigation("/admin/messages")}
            className="flex items-center space-x-2 hover:bg-sky-600 p-3 rounded-md transition-colors duration-200 cursor-pointer"
            title="Messages"
          >
            <IoMdMail className="text-xl" />
            <span className="text-md">Messages</span>
          </li>
          <li
            onClick={() => handleNavigation("/admin/bookings")}
            className="flex items-center space-x-2 hover:bg-sky-600 p-3 rounded-md transition-colors duration-200 cursor-pointer"
            title="Bookings"
          >
            <FaClipboardList className="text-xl" />
            <span className="text-md">Bookings</span>
          </li>
          <li
            onClick={() => handleNavigation("/admin/review")}
            className="flex items-center space-x-2 hover:bg-sky-600 p-3 rounded-md transition-colors duration-200 cursor-pointer"
            title="Review"
          >
            <BiMessageSquareDetail className="text-xl" />
            <span className="text-md">Review</span>
          </li>
          <li
            onClick={() => handleNavigation("/admin/profile")}
            className="flex items-center space-x-2 hover:bg-sky-600 p-3 rounded-md transition-colors duration-200 cursor-pointer"
            title="Profile"
          >
            <RiUserFill className="text-xl" />
            <span className="text-md">Profile</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
