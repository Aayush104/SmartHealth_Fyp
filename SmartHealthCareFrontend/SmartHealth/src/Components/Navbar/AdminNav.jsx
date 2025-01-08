import React from "react";

import { IoIosNotifications } from "react-icons/io";
import { FaRegMessage } from "react-icons/fa6";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import Cookies from "js-cookie"; // Make sure you have `js-cookie` installed
import logo from '../../Assets/Image/Logo.png';// Adjust the logo path accordingly

const AdminNav = () => {
  const handleLogout = () => {
    Cookies.remove("Token");
    window.location.href = "/";
  };

  const token = Cookies.get("Token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const userName = decodedToken.Name || "Admin";

  return (
    <nav className="px-8 py-2 flex justify-between items-center bg-white shadow-md z-50">
      {/* Logo */}
      <img src={logo} alt="Medical Logo" className="w-36 cursor-pointer" />

      {/* Right Section */}
      <div className="flex items-center gap-8">
        {/* Notifications */}
        <div className="flex flex-col justify-center items-center cursor-pointer text-gray-500 font-medium group hover:text-sky-400">
          <IoIosNotifications className="text-3xl mt-1 group-hover:text-sky-400" />
          <span className="mt-1">Notifications</span>
        </div>

        {/* Messages */}
        <div className="flex flex-col justify-center items-center cursor-pointer text-gray-500 font-medium group hover:text-sky-400">
          <FaRegMessage className="text-2xl mt-1.5 group-hover:text-sky-400" />
          <span className="mt-1">Messages</span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2220431045.jpg"
              className="h-16 w-16 rounded-full object-cover"
              alt="Doctor Avatar"
            />
            <p className="text-sky-400 font-medium capitalize">{userName}</p>
            <MdOutlineArrowDropDown className="text-2xl text-gray-500" />
          </div>

          {/* Dropdown Menu */}
          <ul className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={handleLogout}
            >
              <TbLogout2 className="text-gray-400" /> Logout
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
