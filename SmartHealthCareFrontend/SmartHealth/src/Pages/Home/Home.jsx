import React, { useEffect } from 'react';
import Navbar from '../../Components/Navbar/Navbar';

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
