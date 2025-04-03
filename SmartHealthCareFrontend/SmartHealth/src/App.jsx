import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HubConnectionBuilder } from "@microsoft/signalr";
import Cookies from "js-cookie"; // Ensure you have js-cookie installed

// Import pages and components
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
import SearchedDoctor from "./Components/SearchComponent/SearchedDoctor";
import NotFound from "./Components/NotFound/NotFound";
import DoctorDetail from "./Pages/DoctorDetails/DoctorDetails";
import DoctorProfile from "./Pages/DoctorProfile/DoctorProfile";
import ConfirmBooking from "./Components/ConfirmBooking/ConfirmBooking";
import PrivateRoute from "./Components/Protected/PrivateRoute";
import Success from "./Components/Success/Success";
import DoctorAppointments from "./Pages/DoctorAppointmentsPage/DoctorAppointmentsPage";
import ChatPage from "./Pages/ChatPage/ChatPage";
import Doctorverificationdetails from "./Components/Admin Components/Doctorverificationdetails";
import AppointmentConfirmation from "./Components/AppointmentConfirmation/AppointmentConfirmation";
import VideoCall from "./Pages/VideoCall/VideoCall";



import { Protect, RedirectIfAuthenticated } from "./Components/Protected/Protect";
import UnAuthorized from "./Components/Helper/UnAuthorized";
import { toast } from 'react-toastify';
import FAQSection from "./Pages/Q N A/FAQSection";
import ReportPage from "./Pages/ReportPage/ReportPage";

// App component
const App = () => {

 const token = Cookies.get("Token");
  let userId;
  
  if(token) {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    userId = decodedToken.userId;
  }
  
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7070/userhub")
      .withAutomaticReconnect()
      .build();
      
    connection.start().then(() => {
      console.log("Connected to SingleR");
      if (userId) {
        connection.invoke("AddUserToGroup", userId)
          .catch(err => console.error("Error adding to group:", err));
      }
    }).catch(err => {
      console.error("SignalR Connection Error:", err);
    });
    
    connection.on("Logout", () => {
      toast.info("You have been blocked by the admin.");
      Cookies.remove("Token");
      window.location.href = "/login";
    });
    
    return () => {
      connection.stop();
    };
  }, [userId]); 


  return (
    <Router>
   
      <Routes>
        <Route
          path="/"
          element={
            <RedirectIfAuthenticated>
              <Landing />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/patientRegistration"
          element={
            <RedirectIfAuthenticated>
              <PatientRegistration />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/doctorRegistration"
          element={
            <RedirectIfAuthenticated>
              <DoctorRegistration />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/forgetPassword"
          element={
            <RedirectIfAuthenticated>
              <ForgetPassword />
            </RedirectIfAuthenticated>
          }
        />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/FAQ" element={<FAQSection />} />
        <Route path="/meeting/:meetingId" element={<VideoCall />} />
        <Route path="/Doctors" element={<FindDoctor />} />
        <Route path="/Doctors/:id" element={<DoctorDetail />} />
        <Route
          path="/DoctorsDetails/:id"
          element={
            <Protect requiredRole={['Admin']}>
              <Doctorverificationdetails />
            </Protect>
          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/admin/:section"
          element={
            <Protect requiredRole={['Admin']}>
              <Admin />
            </Protect>
          }
        />
        <Route
          path="/DoctorProfile/:name"
          element={
            <Protect requiredRole={['Doctor']}>
              <DoctorProfile />
            </Protect>
          }
        />
        <Route
          path="/home"
          element={
            <Protect requiredRole={['Patient']}>
              <Home />
            </Protect>
          }
        />
        <Route path="/ConfirmEmail/:email/:otp" element={<ConfirmDoctorEmail />} />
        <Route path="/Success" element={<Success />} />
        <Route path="/DoctorAppointments" element={<DoctorAppointments />} />
        <Route path="/unauthorize" element={<UnAuthorized />} />
        <Route path="/searched_doctor" element={<SearchedDoctor />} />
        <Route path="/NotFound" element={<NotFound />} />
        <Route path="/payment-success" element={<AppointmentConfirmation />} />
        <Route path="/Reports" element={<ReportPage />} />
        <Route
          path="/chat"
          element={
            <Protect requiredRole={['Doctor', 'Patient']}>
              <ChatPage />
            </Protect>
          }
        />
        <Route
          path="/Appointment"
          element={
            <Protect requiredRole={['Patient']}>
              <PrivateRoute element={ConfirmBooking} />
            </Protect>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
