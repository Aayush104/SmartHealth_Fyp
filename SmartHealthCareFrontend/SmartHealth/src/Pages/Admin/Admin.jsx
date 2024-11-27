import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import axios from 'axios';
import Dashboard from '../../Components/DashBoard/Dashboard';
import { useParams } from 'react-router-dom';
import VerifyDoc from '../../Components/Admin Components/VerifyDoc';

const Admin = () => {
  const [data, setData] = useState([]);
  const { section } = useParams();

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

  return (
    <div className='h-screen bg-slate-100'>
      <Navbar />
      <div className="flex">
        
        <div className="w-16 md:w-60">
          <Dashboard />
        </div>

       
        <div className="flex-1 mt-4 px-4 ">
          <div className="w-full">
            {section === 'dashboard' && <VerifyDoc />}
          </div>

          {section === 'messages' && (
            <div className="bg-red-600 w-full p-4">
              <p className="text-center text-white font-bold text-xl">This is the Messages section</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
