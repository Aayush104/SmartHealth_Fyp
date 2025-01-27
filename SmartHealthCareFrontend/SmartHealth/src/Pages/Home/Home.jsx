import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Fotter/Fotter";
import Cookies from "js-cookie";
import { User, Calendar, ChevronRight } from "lucide-react";
import axios from "axios";

const Home = () => {
  const [greeting, setGreeting] = useState("");
  const [data, setData] = useState([]);
  const token = Cookies.get("Token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const userName = decodedToken.Name || "Patient";

  // Helper function to format time in 12-hour format
  const formatTime12Hour = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Greeting message logic
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

  // Fetch appointments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7070/api/Appointment/GetAppointmentList",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setData(response.data.data?.$values || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchData();
    localStorage.removeItem("AppointmentDetails");
  }, [token]);

  return (
    <div>
      <Navbar />

      <div className="md:max-w-8xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <p className="text-gray-600 text-lg">{greeting},</p>
          <h1 className="text-2xl font-semibold">Welcome back, {userName}!</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Upcoming Appointments */}
          <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Upcoming Appointments</p>
              <p className="text-3xl font-bold">{data.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <ChevronRight className="text-blue-600" />
            </div>
          </div>

          {/* Tests Scheduled */}
          <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Tests Scheduled</p>
              <p className="text-3xl font-bold">2</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="text-blue-600" />
            </div>
          </div>

          {/* Reports Available */}
          <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Missed Appointments</p>
              <p className="text-3xl font-bold">5</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
          {data.length > 0 ? (
            data.map((appointment, index) => (
              <div
                className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
                key={index}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <img
                      src={appointment.doctorProfile}
                      alt="Doctor"
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Dr. {appointment.doctorName}</p>
                    <p className="text-gray-600 text-sm">
                      {new Date(appointment.appointmentDate).toISOString().split("T")[0]},{" "}
                      {formatTime12Hour(appointment.slot)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
                    Reschedule
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No upcoming appointments.</p>
          )}
        </div>

        {/* Recommended Doctors */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recommended Doctors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((_, index) => (
              <div
                className="bg-white rounded-lg shadow overflow-hidden"
                key={index}
              >
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
      </div>
      <Footer />
    </div>
  );
};

export default Home;
