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
import { Protect, RedirectIfAuthenticated } from "./Components/Protected/Protect";
import UnAuthorized from "./Components/Helper/UnAuthorized";
import SearchedDoctor from "./Components/SearchComponent/SearchedDoctor";
import NotFound from "./Components/NotFound/NotFound";
import DoctorDetail from "./Pages/DoctorDetails/DoctorDetails";
import DoctorProfile from "./Pages/DoctorProfile/DoctorProfile";
import ConfirmBooking from "./Components/ConfirmBooking/ConfirmBooking";
import PrivateRoute from "./Components/Protected/PrivateRoute";
import Success from "./Components/Success/Success";
import DoctorAppointments from "./Pages/DoctorAppointmentsPage/DoctorAppointmentsPage";
import ChatPage from "./Pages/ChatPage/ChatPage";


const App = () => {
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
        <Route path="/patientRegistration" element={
           <RedirectIfAuthenticated>
          <PatientRegistration />
          </RedirectIfAuthenticated>
          } />
        <Route path="/doctorRegistration" element={
          <RedirectIfAuthenticated>         
           <DoctorRegistration />
          </RedirectIfAuthenticated>


          } />
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        <Route path="/forgetPassword" element={
       
          <RedirectIfAuthenticated>
          <ForgetPassword />

          </RedirectIfAuthenticated>
          } />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Doctors" element={<FindDoctor />} />
        <Route path="/Doctors/:id" element={ <DoctorDetail/>} />
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
        <Route path="/home" element={<Protect requiredRole={['Patient']}><Home /> </Protect>} />
        <Route path="/ConfirmEmail/:email/:otp" element={<ConfirmDoctorEmail />} />
        
        <Route path="/success" element={<Protect requiredRole={['Patient']}><Success /> </Protect>} />
        
        <Route path="/DoctorAppointments" element={<Protect requiredRole={['Doctor']}><DoctorAppointments /> </Protect>} />
      
      
        <Route path="//unauthorize" element={<UnAuthorized />} />
        <Route path="/searched_doctor" element={<SearchedDoctor />} />
        <Route path="/NotFound" element={<NotFound />} />
       <Route
  path="/chat"
  element={
    <Protect requiredRole={['Doctor', 'Patient']}>
      <ChatPage />
    </Protect>
  }
/>

        <Route path="/Appointment" element={<Protect requiredRole={['Patient']}><PrivateRoute element={ConfirmBooking} /></Protect> } />
      

      </Routes>
    </Router>
  );
};

export default App;
