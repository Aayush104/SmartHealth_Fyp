import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Fotter/Fotter';
import SearchDoctor from '../../Components/SearchComponent/SearchDoctor';

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7070/api/Doctor/GetDoctorDetails/${id}`);
        setDoctorDetails(response.data);
        console.log(response)
      } catch (err) {
        console.error('Error fetching doctor details:', err);
        setError('Failed to fetch doctor details.');
      }
    };

    fetchDoctorDetails();
  }, [id]);

  return (
    <>
    <Navbar />
    <SearchDoctor />

    <div>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : doctorDetails ? (
        <div>
        <img
                    src="https://media.istockphoto.com/id/177373093/photo/indian-male-doctor.jpg?s=612x612&w=0&k=20&c=5FkfKdCYERkAg65cQtdqeO_D0JMv6vrEdPw3mX1Lkfg="
                    className="h-30 w-40"
                    alt={`Dr. ${doctorDetails.fullName}`}
                  />
          <h2 className="text-2xl font-bold">Dr. {doctorDetails.fullName}</h2>
          <p> {doctorDetails.specialization}</p>
          <p>{doctorDetails.qualifications}</p>
          <p>{doctorDetails.location}</p>
        
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    <Footer />
    </>
  );
};

export default DoctorDetails;