import React from 'react';
import logo from '../../Assets/Image/Logo.png';
import { IoIosNotifications } from "react-icons/io";
import { FaRegMessage } from "react-icons/fa6";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { AiOutlineProfile } from "react-icons/ai";
import { IoIosAddCircleOutline } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { MdEventAvailable } from "react-icons/md";
import Cookies from 'js-cookie';

const DoctorNav = ({ onProfileClick, onAdditionalClick, onAvailabilityClick }) => {
  const handleLogout = () => {
    Cookies.remove("Token");
    window.location.href = "/";
  };

  const token = Cookies.get("Token");
  const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : {};
  const userName = decodedToken.Name || "Doctor";

  return (
    <nav className="px-8 py-2 flex justify-between items-center bg-white shadow-md z-50">
      <img src={logo} alt="Medical Logo" className="w-36 cursor-pointer" />
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-8">
          {/* Notifications Icon with Text */}
          <li className="flex flex-col justify-center items-center cursor-pointer text-gray-500 font-medium group hover:text-sky-400">
            <IoIosNotifications className="text-3xl mt-1 group-hover:text-sky-400" />
            <span className="mt-1">Notifications</span>
          </li>

          {/* Messages Icon with Text */}
          <li className="flex flex-col justify-center items-center cursor-pointer text-gray-500 font-medium group hover:text-sky-400">
            <FaRegMessage className="text-2xl mt-1.5 group-hover:text-sky-400" />
            <span className="mt-1">Messages</span>
          </li>

          {/* Availability Icon with Text */}
          <li className="flex flex-col justify-center items-center cursor-pointer text-gray-500 font-medium group hover:text-sky-400" onClick={onAvailabilityClick}>
            <MdEventAvailable className="text-2xl mt-1.5 group-hover:text-sky-400" />
            <span className="mt-1">Add Availability</span>
          </li>
        </div>

        {/* Profile Dropdown */}
        <div className="relative group">
          <div className="flex items-center justify-between cursor-pointer">
            <img
              src="https://png.pngtree.com/png-vector/20230928/ourmid/pngtree-young-afro-professional-doctor-png-image_10148632.png"
              className="h-12 w-12 rounded-full object-cover"
              alt="Doctor Avatar"
            />
            <p className="text-sky-400 font-medium ml-2 capitalize">Dr. {userName}</p>
            <MdOutlineArrowDropDown className="text-2xl text-gray-500" />
          </div>
          <ul className="absolute right-0 w-48 bg-white border rounded-lg shadow-lg hidden group-hover:block">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={onProfileClick}>
              <AiOutlineProfile className="text-gray-400" /> Complete Profile
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={onAdditionalClick}>
              <IoIosAddCircleOutline className="text-gray-400" /> Additional Profile
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={handleLogout}>
              <TbLogout2 className="text-gray-400" /> Logout
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNav;
