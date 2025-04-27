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
import ReportPage from "../ReportPage/ReportPage";
import ViewReports from "../../Components/Admin Components/ViewReports";

const Admin = () => {
  const [data, setData] = useState([]);
  const { section } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7070/api/Admin/VerifyDoctor");
        setData(response.data.$values);
        console.log("Doctor",response)
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
     <AdminNav />
      
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
            <div className="w-full p-4">
              <p className="text-center text-white font-bold text-xl"><ViewReports /></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;