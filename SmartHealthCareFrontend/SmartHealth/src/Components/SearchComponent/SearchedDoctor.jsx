import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import SearchDoctor from './SearchDoctor';
import { MdVerified } from "react-icons/md";
import Footer from '../Fotter/Fotter';
import { FaCalendarDays } from "react-icons/fa6";
import ChatBot from '../Chat/ChatBot';

const SearchedDoctor = () => {
  const location = useLocation();
  const doctors = location.state?.doctors || [];
  const [hoverIndex, setHoverIndex] = useState(null); 
  const navigateTo = useNavigate();

  useEffect(() => {
    if (doctors.length === 0) {
      navigateTo('/NotFound');
    }
  }, [doctors, navigateTo]);

  const placeholderImage = "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg";

  return (
    <div>
      <Navbar />
      <ChatBot />
      <div className="bg-Doctor_Banner h-75vh flex flex-col justify-center items-center bg-cover">
        {doctors.length > 0 && (
          <h2 className="text-white font-bold font-sans mb-4 text-6xl">
            {doctors[0].specialization}
          </h2>
        )}
        <SearchDoctor />
      </div>

      <div className="mx-8 mt-4">
        <div className="flex gap-1 flex-col border-b py-6">
          <p className="text-2xl font-semibold capitalize">
            {doctors.length} doctors available in {doctors[0]?.location}
          </p>
          <div className="flex gap-2 items-center">
            <MdVerified className="text-2xl" />
            <span className="text-xl font-medium">
              Book appointments with minimum wait-time & verified doctor details
            </span>
          </div>
        </div>

        {doctors.length > 0 ? (
          <div>
            {doctors.map((doctor, index) => (
              <div
                key={index}
                className="border-b py-4 flex gap-4 items-center justify-between"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >

            
                <div className="flex gap-4 items-center">
                <img
              src={doctor?.profileget || placeholderImage}
              className="h-30 w-40 text-white border rounded"
              alt={`Dr. ${doctor?.fullName || "Doctor"}`}
            />
  

                  <div className="flex flex-col gap-2">
                    <a className="text-3xl text-sky-600 cursor-pointer hover:underline">Dr. {doctor.fullName}</a>
                    <p className="text-gray-500 text-md">{doctor.qualifications}</p>
                    <p className="text-gray-500 text-md">{doctor.specialization}</p>
                    <p className="text-gray-500 text-md">{doctor.location}</p>

                    {hoverIndex === index && (
                      
                      <NavLink 
                        to={`/Doctors/${doctor.userId}`} 
                        className="text-sky-500 font-semibold cursor-pointer"
                      >
                        View Profile
                      </NavLink>

                    )}
                  </div>
                </div>
                <NavLink 
                        to={`/Doctors/${doctor.userId}`} 
                        className="cursor-pointer"
                      >
                <button className="flex p-2 gap-2 bg-sky-600 text-white items-center hover:bg-sky-500 rounded-sm">
                  <FaCalendarDays />  
                     
                       Book Appointment
                      
                </button>
                </NavLink>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchedDoctor;
