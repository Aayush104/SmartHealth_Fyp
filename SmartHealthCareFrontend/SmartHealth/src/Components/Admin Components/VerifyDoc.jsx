import axios from 'axios';
import React, { useEffect, useState } from 'react';

const VerifyDoc = () => {
  const [data, setData] = useState([]);
  
  const [rejectmessage, setrejectmessage] = useState(false);
  const [acceptmessage, setacceptmessage] = useState(false);

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
      setacceptmessage(true);
      setrejectmessage(false);
      const response = await axios.post(`https://localhost:7070/api/Doctor/AcceptDoctor/${email}`);
      console.log(response.data);

      

      setData((prevData) => prevData.filter((doctor) => doctor.email !== email));
    } catch (error) {
      console.error('Error accepting doctor', error);
    }
  };

  const handleReject = async (email) => {
    try {
      setrejectmessage(true);
      setacceptmessage(false); 
      const response = await axios.post(`https://localhost:7070/api/Doctor/RejectDoctor/${email}`);
      console.log(response.data);
      setData((prevData) => prevData.filter((doctor) => doctor.email !== email));
    } catch (error) {
      console.error('Error rejecting doctor', error);
    }
  };

  return (
    <div className="w-full">
      <div>
        <p className="text-center text-black font-bold text-3xl mb-8">Doctor Verification Request</p>
        {data.length > 0 ? (
          data.map((doctor) => (
            <div key={doctor.licenseNumber} className="border p-4 rounded-lg shadow-lg mb-4">
              <p className="font-bold"><strong>Name:</strong> {doctor.fullName}</p>
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              <p><strong>License Number:</strong> {doctor.licenseNumber}</p>
              <p><strong>Qualifications:</strong> {doctor.qualifications}</p>
              <p><strong>Status:</strong> {doctor.status}</p>
              <div className="flex mt-4 gap-4">
                {rejectmessage ? (
                  <p className="text-red-500 font-bold">Rejected</p>
                ) : acceptmessage ? (
                  <p className="text-green-500 font-bold">Accepted</p>
                ) : (
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
          ))
        ) : (
          <p className="text-center text-lg">No doctor verification requests available.</p>
        )}
      </div>
    </div>
  );
};

export default VerifyDoc;
