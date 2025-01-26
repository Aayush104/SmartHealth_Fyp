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

    
    </div>
  );
};

export default Home;
