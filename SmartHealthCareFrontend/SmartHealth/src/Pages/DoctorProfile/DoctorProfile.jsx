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
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7070/api/Doctor/GetLoginDoctorData", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctorData(response.data); // Store the response data
        console.log(response.data); // Log the response for reference
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <>
      <div className="mb-8">
        <DoctorNav
          onProfileClick={handleProfileClick}
          onAdditionalClick={handleAdditionalClick}
          onAvailabilityClick={handleAvailabilityClick}
          doctorData={doctorData} 
        />
        {showProfileForm && <CompleteProfile onClose={handleCloseForms}  />}
        {showAdditionalForm && <AdditionalProfile onAdditionalOff={handleCloseForms}  />}
        {showAvailabilityForm && <DoctorAvailability onClose={handleCloseForms} />}
      </div>

      <DoctorDash doctorData={doctorData} />
    </>
  );
};

export default DoctorProfile;
