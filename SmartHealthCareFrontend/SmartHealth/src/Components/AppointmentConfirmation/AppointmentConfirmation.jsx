import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Fotter/Fotter";

const AppointmentConfirmation = () => {
  const location = useLocation();
  const { appointmentDetails, fee } = location.state || {};
  useEffect(()=>
  {
    localStorage.removeItem("AppointmentDetails")
    localStorage.removeItem("PaymentGateway");
 
   
  })

  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-10 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg border shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-sky-500 p-8 text-white">
            <div className="text-3xl font-bold mb-4">Your appointment is confirmed</div>
            <div className="flex items-center">
              <div className="bg-sky-400 p-1 rounded-full mr-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>
                This appointment is <span className="text-sky-200">guaranteed</span> by Smart Health
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-700">Hello {appointmentDetails?.patientName},</p>
              <p className="text-gray-600 mt-2">
                Thanks for booking an appointment on Smart Health. Here are the details of your
                appointment:
              </p>
            </div>

            {/* Details Table */}
            <div className="border rounded-lg overflow-hidden mb-6">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-6 bg-gray-50 text-gray-600">Doctor's name</td>
                    <td className="py-4 px-6">Dr. {appointmentDetails?.doctorName}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6 bg-gray-50 text-gray-600">Date and Time</td>
                    <td className="py-4 px-6">{appointmentDetails?.dateTime}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-6 bg-gray-50 text-gray-600">Patient Name</td>
                    <td className="py-4 px-6">{appointmentDetails?.patientName}</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 bg-gray-50 text-gray-600">Fee</td>
                    <td className="py-4 px-6">₹ {fee}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-600 mb-6">
              If you are unable to make it to the appointment, please cancel or reschedule. It
              will open this valuable slot for others waiting to visit the doctor.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 mb-6">
              <NavLink
                to="/home"
                className="flex-1 bg-sky-500 text-white text-center py-3 rounded-lg hover:bg-sky-600 transition-colors"
              >
                Go Home
              </NavLink>
            </div>

            {/* Manage Appointments Link */}
            <div className="text-center">
              <span className="text-gray-600">
                Manage your appointments better by visiting{" "}
              </span>
              <NavLink to="/appointments" className="text-sky-500 hover:underline">
                My Appointments
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AppointmentConfirmation;
