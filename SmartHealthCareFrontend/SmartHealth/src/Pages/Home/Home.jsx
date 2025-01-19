import React, { useEffect } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import { NavLink } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
  
    localStorage.removeItem('AppointmentDetails');
  }, []); 

  return (
    <div>
      <Navbar />

      <NavLink to= "/chat">
      <button className='bg-sky-400 p-4 text-white rounded-sm m-8 cursor-pointer'>Chat With doctor</button>
      </NavLink>
    </div>
  );
};

export default Home;
