import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Success = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
const [doctorName, setDoctorName] = useState("");

  const q = queryParams.get("q") || "";
  const oid = queryParams.get("oid") || "";
  const amt = queryParams.get("amt") || "";
  const refId = queryParams.get("refId") || "";

  const details = JSON.parse(localStorage.getItem("AppointmentDetails")) || {};
  const startTime = details.StartTime || "Not provided";
  const appointmentDate = details.date || "Not provided";
  const Fee = details.Fee || "Not provided";

  const token = Cookies.get("Token");
  const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : {};
  const userName = decodedToken.Name || "Patient";
  const navigateTo = useNavigate();
  const [success, setSuccess] = useState(null);
  const actionCalled = useRef(false);

  const actions = async () => {



    if (!q || !oid || !amt || !refId || !token) {
      console.error("Missing required parameters or token.");
      return;
    }

    try {
      const requestBody = {
        queryType: q,
        doctorId: oid,
        amount: amt,
        referenceId: refId,
        StartTime: startTime,
        AppointmentDate: appointmentDate,
      };

      console.log("Request Body:", requestBody);

      const response = await axios.post(
        `https://localhost:7070/api/Appointment/BookAppointment`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDoctorName (response.data.data);

      if (response.status === 201) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error during API request:", error);
      setSuccess(false);
    }
  };

  useEffect(() => {
    if (!actionCalled.current) {
      actions();
      actionCalled.current = true;
    }
  }, []);

  const appointmentDetails = {
    patientName: details.patientName || "N/A",
    doctorName: details.doctorName || "N/A",
    dateTime: `${appointmentDate} | ${startTime}`,
   
  };

  if (success === null) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (success === false) {
    return (
      <div className="text-center mt-20 text-red-500">
        Something went wrong. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
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
            <p className="text-gray-700">Hello {userName},</p>
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
                  <td className="py-4 px-6">Dr. {doctorName}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 bg-gray-50 text-gray-600">Date and Time</td>
                  <td className="py-4 px-6">{appointmentDetails.dateTime}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-6 bg-gray-50 text-gray-600">Patient Name</td>
                  <td className="py-4 px-6">
                    <div>{userName}</div>
                    
                  
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 bg-gray-50 text-gray-600">Fee</td>
                  <td className="py-4 px-6">{Fee}</td>
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
          <NavLink to = "/home" className="flex-1 bg-sky-500 text-white text-center py-3 rounded-lg hover:bg-sky-600 transition-colors">
            
              Go Home
          
            </NavLink>
            <button className="flex-1 bg-sky-500 text-white py-3 rounded-lg hover:bg-sky-600 transition-colors">
              Reschedule
            </button>
          </div>

          {/* Manage Appointments Link */}
          <div className="text-center">
            <span className="text-gray-600">
              Manage your appointments better by visiting{" "}
            </span>
            <button className="text-sky-500 hover:underline">My Appointments</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
