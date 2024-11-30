import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./Pages/Landing/Landing";
import PatientRegistration from "./Pages/Registration/PatientRegistration";
import DoctorRegistration from "./Pages/Registration/DoctorRegistration";
import Login from "./Pages/Login/Login";
import ForgetPassword from "./Pages/ForgotPassword/ForgetPassword";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Contact from "./Components/Contact/Contact";
import FindDoctor from "./Pages/FindDoctor/FindDoctor";
import Home from "./Pages/Home/Home";
import Admin from "./Pages/Admin/Admin";
import ConfirmDoctorEmail from "./Pages/ConfirmDoctorEmail/ConfirmDoctorEmail";
import DoctorAvailability from "./Pages/DoctorAvailablity/DoctorAvailability";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
       
              <Landing />
        
          }
        />
        <Route path="/patientRegistration" element={<PatientRegistration />} />
        <Route path="/doctorRegistration" element={<DoctorRegistration />} />
        <Route
          path="/login"
          element={
       
              <Login />
        
          }
        />
        <Route
          path="/forgetPassword"
          element={
           
              <ForgetPassword />
          
          }
        />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Doctors" element={<FindDoctor />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/admin/:section"
          element={
           
              <Admin />
         
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/ConfirmEmail/:email/:otp" element={<ConfirmDoctorEmail />} />
        <Route path="/doctorAvailability" element={<DoctorAvailability />} />
      </Routes>
    </Router>
  );
};

export default App;
