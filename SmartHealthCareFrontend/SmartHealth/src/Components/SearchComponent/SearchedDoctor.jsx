import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import SearchDoctor from './SearchDoctor';

const SearchedDoctor = () => {
  const location = useLocation();
  const doctors = location.state?.doctors || [];
  const navigateTo = useNavigate();

  // Redirect to '/NotFound' if no doctors are found
  useEffect(() => {
    if (doctors.length === 0) {
      navigateTo('/NotFound');
    }
  }, [doctors, navigateTo]);

  return (
    <div>
      <Navbar />
      <div className='bg-Doctor_Banner h-75vh flex flex-col justify-center items-center'>
        {doctors.length > 0 && (
          <h2 className='text-white font-bold font-sans mb-4 text-6xl'>
            {doctors[0].specialization} {/* Displaying specialization of the first doctor */}
          </h2>
        )}
        <SearchDoctor />
      </div>
      {doctors.length > 0 ? (
        <div>
          {doctors.map((doctor, index) => (
            <div key={index} className="border-b py-2">
              <p><strong>Name:</strong> {doctor.fullName}</p>
              <p><strong>Specialty:</strong> {doctor.specialization}</p>
              <p><strong>Location:</strong> {doctor.location}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p> 
      )}
    </div>
  );
};

export default SearchedDoctor;
