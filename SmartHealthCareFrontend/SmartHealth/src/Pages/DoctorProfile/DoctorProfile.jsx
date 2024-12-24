import React, { useState } from 'react';
import DoctorNav from '../../Components/Navbar/DoctorNav';
import CompleteProfile from '../../Components/DoctorComponents/CompleteProfile';
import AdditionalProfile from '../../Components/DoctorComponents/AdditionalProfile';

const DoctorProfile = () => {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showAdditionalForm, setAdditionalForm] = useState(false);

  const handleProfileClick = () => {
    setShowProfileForm(true); 
    document.body.style.overflow = 'hidden'; 
  };

  const handleCloseProfile = () => {
    setShowProfileForm(false); 
    document.body.style.overflow = 'auto'; 
  };

  const handleAdditionalClick = () => {
    setAdditionalForm(true); 
    document.body.style.overflow = 'hidden'; 
  };

  const handleAdditionalclose = () => {
    setAdditionalForm(false); 
    document.body.style.overflow = 'auto'; 
  };

  return (
    <div>
      <DoctorNav onProfileClick={handleProfileClick} onAdditionalClick={handleAdditionalClick} />
      {showProfileForm && <CompleteProfile onClose={handleCloseProfile} />}
      {showAdditionalForm && <AdditionalProfile onAdditionalOff={handleAdditionalclose} />}
    </div>
  );
};

export default DoctorProfile;
