import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
    
    <div>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : doctorDetails ? (
        <div>
          <h2 className="text-2xl font-bold">Dr. {doctorDetails.fullName}</h2>
          <p>Specialization: {doctorDetails.specialization}</p>
          <p>Qualifications: {doctorDetails.qualifications}</p>
          <p>Location: {doctorDetails.location}</p>
        
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DoctorDetails;