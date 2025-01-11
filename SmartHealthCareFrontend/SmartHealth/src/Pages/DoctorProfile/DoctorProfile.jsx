import React, { useEffect, useState } from 'react';
import DoctorNav from '../../Components/Navbar/DoctorNav';
import CompleteProfile from '../../Components/DoctorComponents/CompleteProfile';
import AdditionalProfile from '../../Components/DoctorComponents/AdditionalProfile';
import DoctorAvailability from '../DoctorAvailablity/DoctorAvailability';
import DoctorDash from '../../Components/DoctorDash/DoctorDash';
import Cookies from 'js-cookie';
import axios from 'axios';

const DoctorProfile = () => {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showAdditionalForm, setShowAdditionalForm] = useState(false);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [doctorData, setDoctorData] = useState(null); // Store doctor data
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(null); // State to handle errors

  const handleCloseForms = () => {
    setShowProfileForm(false);
    setShowAdditionalForm(false);
    setShowAvailabilityForm(false);
    document.body.style.overflow = 'auto'; // Enable scrolling
  };

  const handleProfileClick = () => {
    setShowProfileForm(true);
    document.body.style.overflow = 'hidden'; // Disable scrolling
  };

  const handleAdditionalClick = () => {
    setShowAdditionalForm(true);
    document.body.style.overflow = 'hidden';
  };

  const handleAvailabilityClick = () => {
    setShowAvailabilityForm(true);
    document.body.style.overflow = 'hidden';
  };

  const token = Cookies.get("Token");

  useEffect(() => {
    if (!token) {
      console.error("Token not found");
      return; // Exit if no token is found
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset any previous error
      try {
        console.log("Fetching doctor data...");

        const response = await axios.get("https://localhost:7070/api/Doctor/GetLoginDoctorData", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Doctor data fetched:", response.data);
        setDoctorData(response.data); // Store the response data
      } catch (err) {
        console.error("Error fetching doctor data:", err);
        setError("Failed to load doctor data. Please try again.");
      } finally {
        setLoading(false); // Set loading to false after the request is completed
      }
    };

    fetchData();
  }, [token]);

  return (
    <>
      <div className="mb-8">

        {doctorData && (
          <>
            <DoctorNav
              onProfileClick={handleProfileClick}
              onAdditionalClick={handleAdditionalClick}
              onAvailabilityClick={handleAvailabilityClick}
              doctorData={doctorData}
            />
            <DoctorDash doctorData={doctorData} />
          </>
        )}

        {loading && <p>Loading doctor data...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {showProfileForm && <CompleteProfile onClose={handleCloseForms} />}
        {showAdditionalForm && <AdditionalProfile onAdditionalOff={handleCloseForms} />}
        {showAvailabilityForm && <DoctorAvailability onClose={handleCloseForms} />}
      </div>
    </>
  );
};

export default DoctorProfile;
