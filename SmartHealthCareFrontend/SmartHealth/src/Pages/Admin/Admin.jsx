import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import axios from "axios";
import Dashboard from "../../Components/DashBoard/Dashboard";
import { useParams } from "react-router-dom";
import VerifyDoc from "../../Components/Admin Components/VerifyDoc";
import AdminNav from "../../Components/Navbar/AdminNav";
import UsersList from "../../Components/Admin Components/UsersList";
import { IoIosNotifications } from "react-icons/io";
import { FaRegMessage } from "react-icons/fa6";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import Cookies from "js-cookie"; // Make sure you have `js-cookie` installed
import logo from '../../Assets/Image/Logo.png';// Adjust the logo path accordingly
import { MdHome } from "react-icons/md";
import { NavLink } from "react-router-dom";
import AllBookings from "../../Components/Admin Components/AllBookings";
import Announcement from "../../Components/Admin Components/Announcement";

const Admin = () => {
  const [data, setData] = useState([]);
  const { section } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7070/api/Doctor/VerifyDoctor");
        setData(response.data.$values);
      } catch (error) {
        console.error("Error fetching doctor data", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    Cookies.remove("Token");
    window.location.href = "/";
  };
  
  const token = Cookies.get("Token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const userName = decodedToken.Name || "Admin";

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      {/* Fixed navbar at the top */}
      <nav className="px-8 py-2 flex justify-between items-center bg-white shadow-md z-50 sticky top-0">
        {/* Logo */}
        <img src={logo} alt="Medical Logo" className="w-36 cursor-pointer" />
  
        {/* Right Section */}
        <div className="flex items-center gap-8">
          {/* Notifications */}
          <NavLink to="/admin/dashboard">
            <div className="flex flex-col justify-center items-center cursor-pointer text-gray-500 font-medium group hover:text-sky-400">
              <MdHome className="text-3xl mt-1 group-hover:text-sky-400" />
              <span className="mt-1">Home</span>
            </div>
          </NavLink>
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
                Logout
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      {/* Main content area with sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed sidebar */}
        <div className="sticky top-0 h-[calc(100vh-72px)] w-16 md:w-60">
          <Dashboard />
        </div>
        
        {/* Content area with scroll */}
        <div className="flex-1 overflow-y-auto p-4">
          {section === "dashboard" && <VerifyDoc />}
          {section === "users" && (
            <div className="w-full p-2">
              <UsersList />
            </div>
          )}
          {section === "bookings" && (
            <div className="w-full p-4">
              <p className="text-center text-white font-bold text-xl"><AllBookings /></p>
            </div>
          )}
          {section === "broadcast" && (
            <div className=" w-full p-4">
              <p className="text-center text-white font-bold text-xl"><Announcement /> </p>
            </div>
          )}
          {section === "feedback" && (
            <div className="bg-yellow-600 w-full p-4">
              <p className="text-center text-white font-bold text-xl">View Feed backs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;