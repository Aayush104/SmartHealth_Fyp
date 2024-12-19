import React, { useState } from 'react';
import DoctorNav from '../../Components/Navbar/DoctorNav';
import CompleteProfile from '../../Components/DoctorComponents/CompleteProfile';

const DoctorProfile = () => {
  const [showProfileForm, setShowProfileForm] = useState(false);

  const handleProfileClick = () => {
    setShowProfileForm(true); // Show the CompleteProfile form when clicked
    document.body.style.overflow = 'hidden'; // Disable scrolling
  };

  const handleCloseProfile = () => {
    setShowProfileForm(false); // Close the CompleteProfile form when cross is clicked
    document.body.style.overflow = 'auto'; // Enable scrolling again
  };

  return (
    <div>
      <DoctorNav onProfileClick={handleProfileClick} />
      {showProfileForm && <CompleteProfile onClose={handleCloseProfile} />}
    </div>
  );
};

export default DoctorProfile;
