import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoPerson } from "react-icons/io5";
import { NavLink } from 'react-router-dom';

const VerifyDoc = () => {
  const [data, setData] = useState([]);
  const [reject, setRejected] = useState(false)
  const [accepted, setAccepted] = useState('')

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
    setRejected(false)
    setAccepted(true)
    try {
      const response = await axios.post(`https://localhost:7070/api/Doctor/AcceptDoctor/${email}`);
      console.log(response.data);
      setData((prevData) => prevData.filter((doctor) => doctor.email !== email));
    } catch (error) {
      console.error('Error accepting doctor', error);
    }
  };

  const handleReject = async (email) => {

    setRejected(true)
    setAccepted(false)
    try {
      const response = await axios.post(`https://localhost:7070/api/Doctor/RejectDoctor/${email}`);
      console.log(response.data);
      setData((prevData) => prevData.filter((doctor) => doctor.email !== email));
    } catch (error) {
      console.error('Error rejecting doctor', error);
    }
  };

  return (
    <div className="w-full rounded-md bg-white">
      <div>
        <p className="text-black font-semibold text-xl border p-4">Doctor Verification Request</p>
        {data.length > 0 ? (
          data.map((doctor) => (
            <div key={doctor.licenseNumber} className="pt-4 pl-4 pr-4 cursor-pointer border-b mb-4">
              <div className="flex gap-4">
                <img
                  src="https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
                  className="h-20 p-1"
                  alt="Doctor Profile"
                />
                <div className="flex-grow mb-6">
                  <p className="text-sm mb-1.5 font-medium text-gray-500">{doctor.specialization}</p>
                  <p className="text-2xl font-semibold mb-1.5">Dr. {doctor.fullName}</p>
                  <p className="font-medium text-gray-500">Biratnagar</p>
                  <div className="ml-auto flex items-center mt-6 gap-4">
                  {reject ? (
                      <p className="text-red-500 font-bold">Rejected</p>
                    ) :  accepted ? (
                      <p className="text-green-500 font-bold">Accepted</p>
                    ) :
                  (
                    <>
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
                    </>
                  )}
                </div>
                  
                </div>
          <div className="relative flex items-center justify-center mt-12 h-12 gap-1 px-4 border rounded-md p-2 overflow-hidden group">
  <span className="relative z-10 flex items-center gap-1 text-black group-hover:text-white transition duration-300 ease-in-out">
    <IoPerson />
    <NavLink to = {`/Doctors/${doctor.userId}`}>
   
    <p>View Profile</p>
    </NavLink>
  </span>
  <div className="absolute inset-0 bg-sky-500 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></div>
</div>


              </div>
             
 


            </div>
          ))
        ) : (
          <p className="text-center text-lg">No doctor verification requests available.</p>
        )}
      </div>
    </div>
  );
};

export default VerifyDoc;
