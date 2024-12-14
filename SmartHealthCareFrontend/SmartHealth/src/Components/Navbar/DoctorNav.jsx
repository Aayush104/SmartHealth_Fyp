import React from 'react';
import logo from '../../Assets/Image/Logo.png'; 
import { IoIosNotifications } from "react-icons/io";
import { FaRegMessage } from "react-icons/fa6";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { Link } from 'react-router-dom';

const DoctorNav = () => {
  return (
    <nav className='px-8 pl-8 py-1 flex justify-between items-center bg-white shadow-md'>
      <img src={logo} alt="Medical Logo" className="w-36 cursor-pointer" />

      <div className='flex items-center gap-8'>
        <div className='flex gap-8'> 
          <IoIosNotifications className='text-gray-500 text-3xl mt-1' />
          <FaRegMessage className='text-gray-500 text-2xl mt-1.5' />
        </div>

        <div className='relative group'>
       
          <div className='flex items-center cursor-pointer'>
            <img
              src='https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg'
              className='h-10 rounded-full'
              alt="Doctor Avatar"
            />
            <p className='text-sky-400 font-medium ml-2'>Dr. Aayush Adhikari</p>
            <MdOutlineArrowDropDown className="text-2xl" />
          </div>

          
          <ul className='absolute right-0  w-48 bg-white border rounded-lg shadow-lg hidden group-hover:block'>
            <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
              <Link to="/profile">Complete Profile</Link>
            </li>
            <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
              <Link to="/logout">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNav;
