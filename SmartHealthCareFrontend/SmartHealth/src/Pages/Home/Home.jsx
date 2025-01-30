import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Fotter/Fotter";
import Cookies from "js-cookie";
import { User, Calendar, ChevronRight } from "lucide-react";
import axios from "axios";

const Home = () => {
  const [greeting, setGreeting] = useState("");
  const [appointments, setAppointments] = useState([]);
  
  const token = Cookies.get("Token");
  let decodedToken = {};
  try {
    decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : {};
  } catch (error) {
    console.error("Invalid Token:", error);
  }
  
  const userName = decodedToken.Name || "Patient";

  const formatTime12Hour = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Fetch and update appointments every 30 seconds
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          "https://localhost:7070/api/Appointment/GetAppointmentList",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setAppointments(response.data.data?.$values || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();  // Initial fetch
    const interval = setInterval(fetchAppointments, 30000);  // Refetch every 30 seconds

    return () => clearInterval(interval);  // Cleanup on component unmount
  }, [token]);

  useEffect(() => {
    const currentHour = new Date().getHours();
    const greetingMessage =
      currentHour < 12
        ? "Good Morning 😎"
        : currentHour < 18
        ? "Good Afternoon 🌄"
        : "Good Night 🌆";
    setGreeting(greetingMessage);
  }, []);

  return (
    <div>
      <Navbar />
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

        <AppointmentList appointments={appointments} formatTime={formatTime12Hour} />
        <RecommendedDoctors />
      </div>
      <Footer />
    </div>
  );
};

const InfoCard = ({ title, count, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
    <div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-3xl font-bold">{count}</p>
    </div>
    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
      {icon}
    </div>
  </div>
);

const AppointmentList = ({ appointments, formatTime }) => (
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
                src={appointment.doctorProfile || "default-avatar.png"}
                alt="Doctor"
                className="rounded-full"
              />
            </div>
            <div>
              <p className="font-medium">Dr. {appointment.doctorName}</p>
              <p className="text-gray-600 text-sm">
                {new Date(appointment.appointmentDate).toISOString().split("T")[0]},{ " "}
                {formatTime(appointment.slot)} - {formatTime(appointment.endTime)}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
              Reschedule
            </button>
            <button
              className={`px-4 py-2 rounded  ${appointment.isButtonEnabled ? "bg-sky-500 text-white cursor-pointer" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
              disabled={!appointment.isButtonEnabled}
            >
              {appointment.isButtonEnabled ? "Join Appointment" : "Join Appointment"}
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-600">No upcoming appointments.</p>
    )}
  </div>
);

const RecommendedDoctors = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Recommended Doctors</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((_, index) => (
        <div className="bg-white rounded-lg shadow overflow-hidden" key={index}>
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-medium">Dr. Alex Johnson</h3>
              <p className="text-gray-600 text-sm">Cardiologist</p>
            </div>
            <button className="w-full py-2 bg-blue-600 text-white rounded">
              Book Appointment
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Home;
