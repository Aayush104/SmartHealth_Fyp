import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import axios from 'axios';
import SearchDoctor from '../../Components/SearchComponent/SearchDoctor';
import Dashboard from '../../Components/DashBoard/Dashboard';

const Admin = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7070/api/Doctor/VerifyDoctor');
        setData(response.data.$values);
      } catch (error) {
        console.error('Error fetching doctor data', error);
      }
    };

    fetchData();
  }, []);

  const handleAccept = async (email) => {
    try {
      const response = await axios.post(`https://localhost:7070/api/Doctor/AcceptDoctor/${email}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error accepting doctor', error);
    }
  };

  const handleReject = async (email) => {
    try {
      const response = await axios.post(`https://localhost:7070/api/Doctor/RejectDoctor/${email}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error rejecting doctor', error);
    }
  };

  return (
    <div>
      <Navbar />

  <Dashboard />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((doctor) => (
            <div key={doctor.licenseNumber} className="border p-4 rounded-lg shadow-lg">
              <p className="font-bold"><strong>Name:</strong> {doctor.fullName}</p>
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              <p><strong>License Number:</strong> {doctor.licenseNumber}</p>
              <p><strong>Qualifications:</strong> {doctor.qualifications}</p>
              <p><strong>Status:</strong> {doctor.status}</p>
              <div className="mt-2 w-20 flex gap-4">
                <img src={doctor.licenseFilePath} alt="License" className="h-20 w-20 object-cover" />
                <img src={doctor.qualificationsFilePath} alt="Qualifications" className="h-20 w-20 object-cover" />
                <img src={doctor.governmentIdFilePath} alt="Government ID" className="h-20 w-20 object-cover" />
              </div>
              <div className="flex mt-4 gap-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                  onClick={() => handleAccept(doctor.email)}
                >
                  Accept
                </button>

                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  onClick={() => handleReject(doctor.email)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
