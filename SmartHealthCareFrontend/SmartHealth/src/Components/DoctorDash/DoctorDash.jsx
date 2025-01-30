import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import Cookies from 'js-cookie';

const DoctorDash = ({ doctorData }) => {
  const [greeting, setGreeting] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [connection, setConnection] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false);

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

  return (
    <div className="min-h-screen">
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
              <div className="text-lg font-medium">Dr. {doc?.fullName}</div>
              <div className="text-sm text-gray-500">{doc?.specialization}</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Appointments */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Appointments</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">25</h3>
              </div>
              <span className="text-green-500 text-sm font-medium">+5</span>
            </div>
          </div>
          {/* Confirmed Appointments */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Confirmed Appointments</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">20</h3>
              </div>
              <span className="text-green-500 text-sm font-medium">+2</span>
            </div>
          </div>
          {/* Video Consultations */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Video Consultations</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">10</h3>
              </div>
              <span className="text-green-500 text-sm font-medium">+3</span>
            </div>
          </div>
          {/* Pending Appointments */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Pending Appointments</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">5</h3>
              </div>
              <span className="text-red-500 text-sm font-medium">-1</span>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
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
                  <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
                    Reschedule
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${
                      appointment.isButtonEnabled
                        ? "bg-sky-500 text-white cursor-pointer"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                    disabled={!appointment.isButtonEnabled}
                  >
                    Join Appointment
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No upcoming appointments.</p>
          )}
        </div>

        {/* Quick Actions and Schedule */}
        <div className="space-y-8 mt-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Start Video Call', 'View Schedule', 'Patient Records', 'Write Prescription'].map(
                (action, index) => (
                  <button
                    key={index}
                    className="p-4 rounded-lg bg-sky-50 hover:bg-sky-100 transition-colors text-sm text-sky-700 font-medium text-center"
                  >
                    {action}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Schedule Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Schedule Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Next available slot</span>
                <span className="font-medium">Today, 04:30 PM</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Appointments today</span>
                <span className="font-medium">8 remaining</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Video consultations</span>
                <span className="font-medium">5 scheduled</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 border border-sky-500 text-sky-500 rounded-lg hover:bg-sky-50 transition-colors">
              View Full Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDash;