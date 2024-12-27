import React, { useState } from 'react';
import DoctorNav from '../../Components/Navbar/DoctorNav';
import CompleteProfile from '../../Components/DoctorComponents/CompleteProfile';
import AdditionalProfile from '../../Components/DoctorComponents/AdditionalProfile';
import DoctorAvailability from '../DoctorAvailablity/DoctorAvailability';

const DoctorProfile = () => {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showAdditionalForm, setShowAdditionalForm] = useState(false);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);

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

  

  return (
    <div>
      <DoctorNav
        onProfileClick={handleProfileClick}
        onAdditionalClick={handleAdditionalClick}
        onAvailabilityClick={handleAvailabilityClick}
      />
      {showProfileForm && <CompleteProfile onClose={handleCloseForms} />}
      {showAdditionalForm && <AdditionalProfile onAdditionalOff={handleCloseForms} />}
      {showAvailabilityForm && <DoctorAvailability onClose={handleCloseForms} />}
    </div>
  );
};

export default DoctorProfile;
