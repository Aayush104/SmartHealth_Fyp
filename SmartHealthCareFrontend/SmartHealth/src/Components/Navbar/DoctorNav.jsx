import React from 'react';
import logo from '../../Assets/Image/Logo.png';
import { IoIosNotifications } from "react-icons/io";
import { FaRegMessage } from "react-icons/fa6";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { Link } from 'react-router-dom';
import { TbLogout2 } from 'react-icons/tb';
import { AiOutlineProfile } from 'react-icons/ai';
import Cookies from 'js-cookie';
import { IoIosAddCircleOutline } from "react-icons/io";

const DoctorNav = ({ onProfileClick, onAdditionalClick }) => {
  const handleLogout = () => {
    Cookies.remove("Token");
    window.location.href = "/";
  };

  const token = Cookies.get("Token");
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const userName = decodedToken.Name;

  return (
    <nav className="px-8 py-2 flex justify-between items-center bg-white shadow-md z-50">
      <img src={logo} alt="Medical Logo" className="w-36 cursor-pointer" />

      <div className="flex items-center gap-8">
        <div className="flex gap-8">
          <IoIosNotifications className="text-gray-500 text-3xl mt-1 cursor-pointer hover:text-sky-400" />
          <FaRegMessage className="text-gray-500 text-2xl mt-1.5 cursor-pointer hover:text-sky-400" />
        </div>

        <div className="relative group">
          <div className="flex items-center cursor-pointer">
            <img
              src="https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
              className="h-10 w-10 rounded-full object-cover"
              alt="Doctor Avatar"
            />
            <p className="text-sky-400 font-medium ml-2 capitalize">Dr. {userName}</p>
            <MdOutlineArrowDropDown className="text-2xl text-gray-500" />
          </div>

          <ul className="absolute right-0 w-48 bg-white border rounded-lg shadow-lg hidden group-hover:block">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={onProfileClick} 
            >
              <AiOutlineProfile className="text-lg text-gray-500" /> Complete Profile
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={onAdditionalClick} 
            >
              <IoIosAddCircleOutline  className="text-lg text-gray-500" /> Additional Info
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={handleLogout}
            >
              <TbLogout2 className="text-lg text-gray-500" /> Logout
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNav;
