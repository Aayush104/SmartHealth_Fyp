import React from 'react'
import PatientRegistration from './Pages/Registration/PatientRegistration.Jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Pages/Login/Login';
import ForgetPassword from './Pages/ForgotPassword/ForgetPassword';

import Landing from './Pages/Landing/Landing';
import Home from './Pages/Home/Home';
import DoctorRegistration from './Pages/Registration/DoctorRegistration';
import Admin from './Pages/Admin/Admin';
import ConfirmDoctorEmail from './Pages/ConfirmDoctorEmail/ConfirmDoctorEmail'
import DoctorAvailability from './Pages/DoctorAvailablity/DoctorAvailability';
import Otp from './Components/Otp/Otp';
import AboutUs from './Pages/AboutUs/AboutUs';
import Contact from './Components/Contact/Contact';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/patientRegistration" element={<PatientRegistration />} />
        <Route path="/doctorRegistration" element={<DoctorRegistration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/ConfirmEmail/:email/:otp" element={<ConfirmDoctorEmail />} />
        <Route path="/doctorAvailability" element={<DoctorAvailability />} />
        <Route path="/contact" element={<Contact />} />
    
    
      </Routes>
    </Router>
  );
};

export default App;
