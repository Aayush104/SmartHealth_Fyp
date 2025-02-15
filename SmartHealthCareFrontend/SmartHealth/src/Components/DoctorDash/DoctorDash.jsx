import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import RevenueChart from '../Charts/RevenueChart';
import Footer from '../Fotter/Fotter';

const DoctorDash = ({ doctorData }) => {
  const [greeting, setGreeting] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [connection, setConnection] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false);
const navigateTo = useNavigate()

  const token = Cookies.get("Token");
  let decodedToken = {};
  try {
    decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : {};
  } catch (error) {
    console.error("Invalid Token:", error);
  }

  const userName = decodedToken.Name || "Patient";

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // SignalR Connection Setup
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7070/apppointmenthub")
      .build();

    newConnection
      .start()
      .then(() => console.log("Connected to SignalR"))
      .catch((err) => console.log("Error connecting to SignalR", err));

    newConnection.on(
      "ReceiveAppointmentStatusChange",
      (appointmentId, isButtonEnabled) => {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === appointmentId
              ? { ...appointment, isButtonEnabled }
              : appointment
          )
        );
        setForceUpdate((prev) => !prev);
      }
    );

    setConnection(newConnection);

    return () => {
      newConnection.stop().then(() => console.log("SignalR connection stopped"));
    };
  }, []);

  // Fetch Appointments
  useEffect(() => {
    if (!token) return;

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7070/api/Appointment/GetAppointmentList",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

      

        console.log("response", response)
        const appointments = response.data.data?.$values || [];
        const currentDate = new Date();
        const filteredAppointments = appointments.filter((appointment) => {
          const appointmentDate = new Date(appointment.appointmentDate);
          const endTime = appointment.endTime ? appointment.endTime.split(":") : [];
          const endDateTime = new Date(appointmentDate);
          
          if (endTime.length === 2) {
            endDateTime.setHours(parseInt(endTime[0], 10));
            endDateTime.setMinutes(parseInt(endTime[1], 10));
          }
    
          return appointmentDate > currentDate || endDateTime > currentDate;
        });
    
        setAppointments(filteredAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [token, forceUpdate]);

  // Set Greeting
  useEffect(() => {
    const currentHour = new Date().getHours();
    let greetingMessage = '';

    if (currentHour < 12) {
      greetingMessage = 'Good Morning';
    } else if (currentHour < 18) {
      greetingMessage = 'Good Afternoon';
    } else {
      greetingMessage = 'Good Evening';
    }

    setGreeting(greetingMessage);
  }, []);

  const placeholderImage = "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg";
  const doc = doctorData?.data?.doctor;

  const handleJoinAppointment = (meetingId) => {
    navigateTo(`/meeting/${meetingId}`);
  };
  
 


  return (
    <div className="h-screen">
   
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile and Welcome Section */}
        
        <div className="items-center justify-between mb-8">
          <div>
            <h3>{greeting}</h3>
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome back, Dr. {doc?.fullName}
            </h2>
            <p className="text-gray-600">Here's your practice overview for today</p>
          </div>
          {/* Profile Picture Section */}
          <div className="flex mt-2 items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-sky-200 overflow-hidden">
              <img
                src={doc?.profileget || placeholderImage}
                alt="Doctor Profile"
                className="w-20 h-20 object-cover"
              />
            </div>
            <div>
              <div className="text-2xl font-medium">Dr. {doc?.fullName}</div>
              <div className="text-sm text-gray-500">{doc?.specialization}</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Appointments */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Appointments</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">25</h3>
              </div>
            
            </div>
          </div>
          {/* Confirmed Appointments */}
        
          {/* Video Consultations */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Video Consultations</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">10</h3>
              </div>
          
            </div>
          </div>
          {/* Pending Appointments */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Pending Appointments</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">5</h3>
              </div>
             
            </div>
          </div>
        </div>

        <RevenueChart />

        {/* Appointments List */}
        <div className="space-y-4">
        <motion.h2
        className="text-gray-600 font-bold text-2xl md:text-[2.3rem] mx-10 uppercase mt-12"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
       Appointments
      </motion.h2>
      <div className="relative flex items-center mx-1">
        <div className="w-8 h-8 bg-sky-600 rounded-full"></div>
        <div className="h-1 w-80 bg-sky-600"></div>
      </div>
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <div
                className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
                key={index}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <img
                      src={placeholderImage}
                      alt="Patient"
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{appointment.patientFullName}</p>
                    <p className="text-gray-600 text-sm">
                      {appointment.appointmentDate.split("T")[0]},{" "}
                      {formatTime(appointment.slot)} - {formatTime(appointment.endTime)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
             
                  <button
                  className={`px-4 py-2 rounded ${appointment.isButtonEnabled ? "bg-sky-500 text-white" : "bg-gray-300 text-gray-600"}`}
                  disabled={!appointment.isButtonEnabled}
                  onClick={() => appointment.isButtonEnabled && handleJoinAppointment(appointment.meetingId)}
                >
                  Join Appointment
                </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No upcoming appointments.</p>
          )}
        </div>

  
      </div>
      <Footer />
    </div>
    
  );
};

export default DoctorDash;