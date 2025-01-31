import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Fotter/Fotter";
import Cookies from "js-cookie";
import { User, Calendar, ChevronRight } from "lucide-react";
import axios from "axios";
import { HubConnectionBuilder } from "@microsoft/signalr";
import MeetingVerify from "../../Components/MeetingVerifyComponent/MeetingVerify";

const Home = () => {
  const [greeting, setGreeting] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [connection, setConnection] = useState(null);
  const [showAdditionalForm, setShowAdditionalForm] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  const token = Cookies.get("Token");
  let decodedToken = {};
  try {
    decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : {};
  } catch (error) {
    console.error("Invalid Token:", error);
  }

  const userName = decodedToken.Name || "Patient";

  const handleCloseForms = () => {
    setShowAdditionalForm(false);
    document.body.style.overflow = "auto";
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7070/apppointmenthub")
      .build();

    newConnection
      .start()
      .then(() => console.log("Connected to SignalR"))
      .catch((err) => console.log("Error connecting to SignalR", err));

    newConnection.on("ReceiveAppointmentStatusChange", (appointmentId, isButtonEnabled) => {
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, isButtonEnabled } : appointment
        )
      );
      setForceUpdate((prev) => !prev);
    });

    setConnection(newConnection);
    return () => newConnection.stop().then(() => console.log("SignalR connection stopped"));
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchAppointments = async () => {
      try {
        const response = await axios.get("https://localhost:7070/api/Appointment/GetAppointmentList", {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  useEffect(() => {
    const currentHour = new Date().getHours();
    const greetingMessage =
      currentHour < 12 ? "Good Morning 😎" : currentHour < 18 ? "Good Afternoon 🌄" : "Good Night 🌆";
    setGreeting(greetingMessage);
  }, []);

  const HandleJoinAppointment = () => {
    setShowAdditionalForm(true);
  };

  return (
    <div>
      <Navbar />
      {showAdditionalForm && <MeetingVerify onClose={handleCloseForms} />}
      <div className="md:max-w-8xl mx-auto p-6 space-y-8">
        <div className="space-y-1">
          <p className="text-gray-600 text-lg">{greeting},</p>
          <h1 className="text-2xl font-semibold">Welcome back, {userName}!</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard title="Upcoming Appointments" count={appointments.length} icon={<ChevronRight />} />
          <InfoCard title="Tests Scheduled" count={2} icon={<Calendar />} />
          <InfoCard title="Missed Appointments" count={5} icon={<User />} />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between" key={index}>
                <div className="flex items-center space-x-4">
                  <img src={appointment.doctorProfile || "default-avatar.png"} alt="Doctor" className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-medium">Dr. {appointment.doctorName}</p>
                    <p className="text-gray-600 text-sm">
                      {appointment.appointmentDate.split("T")[0]}, {formatTime(appointment.slot)} - {formatTime(appointment.endTime)}
                    </p>
                  </div>
                </div>
                <button
                  className={`px-4 py-2 rounded ${appointment.isButtonEnabled ? "bg-sky-500 text-white" : "bg-gray-300 text-gray-600"}`}
                  disabled={!appointment.isButtonEnabled}
                  onClick={appointment.isButtonEnabled ? HandleJoinAppointment : undefined}
                >
                  Join Appointment
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No upcoming appointments.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const InfoCard = ({ title, count, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
    <div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-gray-600 text-sm">{count}</p>
    </div>
    {icon}
  </div>
);

export default Home;
