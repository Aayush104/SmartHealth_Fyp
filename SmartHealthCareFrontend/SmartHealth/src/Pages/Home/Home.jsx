import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Fotter/Fotter";
import Cookies from "js-cookie";
import { User, Calendar, Clock, ChevronRight, Activity, History, CalendarCheck } from "lucide-react";
import axios from "axios";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { NavLink, useNavigate } from "react-router-dom";
import MentalHealth from "../../Components/MentalHealthSection/MentalHealth";
import TestiMonial from "../../Components/TestiMonial/TestiMonial";
import { motion } from "framer-motion";

const Home = () => {
  const [greeting, setGreeting] = useState("");
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [connection, setConnection] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigateTo = useNavigate();
  const [totalAppointments, setTotalAppointments] = useState([]);

  const token = Cookies.get("Token");
  let decodedToken = {};
  try {
    decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : {};
  } catch (error) {
    console.error("Invalid Token:", error);
  }

  const userName = decodedToken.Name || "Patient";

  // Improved time formatting to ensure 12-hour format
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
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
      setUpcomingAppointments((prevAppointments) =>
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
      setLoading(true);
      try {
        const response = await axios.get("https://localhost:7070/api/Appointment/GetAppointmentList", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const appointments = response.data.data?.$values || [];
        const currentDate = new Date();
        
        // Improved filtering logic to properly separate past and upcoming appointments
        const upcoming = [];
        const past = [];
        
        appointments.forEach(appointment => {
          // Create appointment date object
          const appointmentDate = new Date(appointment.appointmentDate);
          
          // Parse end time to get hours and minutes
          const endTime = appointment.endTime ? appointment.endTime.split(":") : [];
          const endDateTime = new Date(appointmentDate);
          
          if (endTime.length === 2) {
            endDateTime.setHours(parseInt(endTime[0], 10));
            endDateTime.setMinutes(parseInt(endTime[1], 10));
          }
          
          // Compare with current date/time to determine if it's past or upcoming
          if (endDateTime > currentDate) {
            upcoming.push(appointment);
          } else {
            past.push(appointment);
          }
        });
        
        setTotalAppointments(appointments);
        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token, forceUpdate]);

  useEffect(() => {
    const currentHour = new Date().getHours();
    const greetingMessage =
      currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";
    setGreeting(greetingMessage);
  }, []);

  const handleJoinAppointment = (meetingId) => {
    navigateTo(`/meeting/${meetingId}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8
      }
    }
  };

  const appointmentCardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        {/* Hero Section with Animation */}
        <motion.div 
          className="bg-gradient-to-r p-6 from-sky-600 to-blue-400 text-white"
          initial="hidden"
          animate="visible"
          variants={heroVariants}
        >
          <div className="container mx-auto px-4 py-12 md:py-16">
            <motion.div 
              className="max-w-3xl"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.p 
                className="text-xl font-light mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {greeting},
              </motion.p>
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Welcome back, {userName}!
              </motion.h1>
              <motion.p 
                className="text-lg opacity-90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                Your health journey continues with us. Track your appointments and wellness in one place.
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Dashboard Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <InfoCard 
                title="Upcoming Appointments" 
                count={upcomingAppointments.length} 
                icon={<CalendarCheck className="text-sky-500" size={24} />}
                description="Scheduled sessions" 
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InfoCard 
                title="Past Appointments" 
                count={pastAppointments.length} 
                icon={<History className="text-indigo-500" size={24} />}
                description="Previous consultations" 
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <InfoCard 
                title="Total Appointments" 
                count={totalAppointments.length} 
                icon={<Activity className="text-emerald-500" size={24} />}
                description="Overall activity" 
              />
            </motion.div>
          </motion.div>
          
          {/* Upcoming Appointments */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="py-8 w-full">
                <motion.h2
                  className="text-3xl md:text-4xl font-semibold text-sky-600 text-center mb-3"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                >
                  Upcoming Appointments
                </motion.h2>
                
                <motion.div 
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="h-1 w-40 md:w-56 bg-sky-400 rounded-full"></div>
                </motion.div>
                
                <motion.p
                  className="text-gray-600 text-center max-w-2xl mx-auto mt-5 px-4 text-sm md:text-base"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  View and manage your scheduled sessions with practitioners
                </motion.p>
              </div>
              {upcomingAppointments.length > 0 && (
                <motion.button 
                  className="text-sky-500 hover:text-sky-600 flex items-center text-sm font-medium"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  View All <ChevronRight size={14} />
                </motion.button>
              )}
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <motion.div 
                  className="flex space-x-2"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "loop" 
                  }}
                >
                  <div className="h-3 w-3 bg-sky-400 rounded-full"></div>
                  <div className="h-3 w-3 bg-sky-400 rounded-full"></div>
                  <div className="h-3 w-3 bg-sky-400 rounded-full"></div>
                </motion.div>
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {upcomingAppointments.map((appointment, index) => (
                  <motion.div 
                    className="bg-gray-50 rounded-lg p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between"
                    key={index}
                    variants={appointmentCardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index}
                  >
                    <div className="flex items-start md:items-center mb-4 md:mb-0">
                      <motion.div 
                        className="bg-white rounded-full p-3 shadow-sm mr-4"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <img
                          src={appointment.doctorProfile || "https://ui-avatars.com/api/?name=Doctor&background=0D8ABC&color=fff"}
                          alt="Doctor"
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://ui-avatars.com/api/?name=Doctor&background=0D8ABC&color=fff";
                          }}
                        />
                      </motion.div>
                      <div>
                        <p className="font-semibold text-lg text-gray-800">Dr. {appointment.doctorName}</p>
                        <div className="flex items-center text-gray-500 mt-1">
                          <Calendar size={16} className="mr-1" />
                          <span className="text-sm">{formatDate(appointment.appointmentDate)}</span>
                        </div>
                        <div className="flex items-center text-gray-500 mt-1">
                          <Clock size={16} className="mr-1" />
                          <span className="text-sm">
                            {formatTime(appointment.slot)} - {formatTime(appointment.endTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      className={`rounded-lg px-6 py-3 font-medium transition-all ${
                        appointment.isButtonEnabled 
                          ? "bg-sky-500 text-white hover:bg-sky-600 shadow-sm" 
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!appointment.isButtonEnabled}
                      onClick={() => appointment.isButtonEnabled && handleJoinAppointment(appointment.meetingId)}
                      whileHover={appointment.isButtonEnabled ? { scale: 1.05 } : {}}
                      whileTap={appointment.isButtonEnabled ? { scale: 0.95 } : {}}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {appointment.isButtonEnabled ? "Join Now" : "Not Available Yet"}
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2
                  }}
                >
                  <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                </motion.div>
                <motion.p 
                  className="text-gray-500 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  No upcoming appointments
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <NavLink to="/Doctors">
                    <motion.button 
                      className="text-sky-500 hover:text-sky-600 font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Schedule an appointment
                    </motion.button>
                  </NavLink>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
          
      {/* Mental Health Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <MentalHealth />
          </motion.div>
          
          {/* Testimonials */}
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <TestiMonial />
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const InfoCard = ({ title, count, icon, description }) => (
  <motion.div 
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    whileHover={{ 
      scale: 1.03, 
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
    }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <div className="flex items-start">
      <motion.div 
        className="bg-gray-50 p-3 rounded-lg mr-4"
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        <motion.p 
          className="text-2xl font-bold text-sky-500"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {count}
        </motion.p>
      </div>
    </div>
  </motion.div>
);

export default Home;