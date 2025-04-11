import React, { useEffect, useState } from "react";
import Footer from "../../Components/Fotter/Fotter";
import axios from "axios";
import Cookies from "js-cookie";
import { Calendar, Clock, User, AlertCircle, CheckCircle, Search, ArrowUpDown, Video, UserRound, PlayCircle, Heart, X, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [videoModal, setVideoModal] = useState({ show: false, url: "" });
  const token = Cookies.get("Token");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://localhost:7070/api/Appointment/UserAppointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("UserAppointments", response);
        const appointmentsData = response.data.data.$values || [];
        setAppointments(appointmentsData);
        filterAppointments(appointmentsData, activeTab);
      } catch (error) {
        console.error("Error fetching appointments", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    filterAppointments(appointments, activeTab, searchQuery);
  }, [activeTab, searchQuery]);

  const filterAppointments = (appointments, tabType, query = "") => {
    const now = new Date();
    
    let filtered = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const [hours, minutes] = appointment.slot.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      if (tabType === "upcoming") {
        return appointmentDate > now;
      } else {
        return appointmentDate <= now;
      }
    });

    // Apply search filter if query exists
    if (query.trim() !== "") {
      filtered = filtered.filter(appointment => 
        appointment.doctorName.toLowerCase().includes(query.toLowerCase()) ||
        appointment.speciality.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      const [hoursA, minutesA] = a.slot.split(':').map(Number);
      const [hoursB, minutesB] = b.slot.split(':').map(Number);
      dateA.setHours(hoursA, minutesA, 0, 0);
      dateB.setHours(hoursB, minutesB, 0, 0);
      
      return tabType === "upcoming" ? dateA - dateB : dateB - dateA;
    });

    setFilteredAppointments(filtered);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getStatusColor = (date, time) => {
    const now = new Date();
    const appointmentDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    appointmentDate.setHours(hours, minutes, 0, 0);
    
    const timeDiff = appointmentDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (appointmentDate < now) {
      return 'bg-green-100 text-green-800'; // Completed
    } else if (hoursDiff <= 24) {
      return 'bg-yellow-100 text-yellow-800'; // Within 24 hours
    } else {
      return 'bg-sky-100 text-sky-800'; // Upcoming
    }
  };

  const getStatusText = (date, time) => {
    const now = new Date();
    const appointmentDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    appointmentDate.setHours(hours, minutes, 0, 0);
    
    const timeDiff = appointmentDate.getTime() - now.getTime();
    const secondsDiff = Math.floor(timeDiff / 1000);
    
    if (appointmentDate < now) {
      return 'Completed';
    } else if (secondsDiff < 60) {
      return `In ${secondsDiff} seconds`;
    } else if (secondsDiff < 3600) {
      const minutesDiff = Math.floor(secondsDiff / 60);
      return `In ${minutesDiff} ${minutesDiff === 1 ? 'minute' : 'minutes'}`;
    } else if (secondsDiff < 86400) {
      const hoursDiff = Math.floor(secondsDiff / 3600);
      return `In ${hoursDiff} ${hoursDiff === 1 ? 'hour' : 'hours'}`;
    } else {
      const daysDiff = Math.floor(secondsDiff / 86400);
      return `In ${daysDiff} ${daysDiff === 1 ? 'day' : 'days'}`;
    }
  };
  const openVideoModal = (url) => {
    setVideoModal({ show: true, url });
  };

  const closeVideoModal = () => {
    setVideoModal({ show: false, url: "" });
  };

  return (
    <><Navbar />
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-sky-50">
      {/* Video Modal */}
      <AnimatePresence>
        {videoModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full"
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Video className="h-5 w-5 text-sky-500 mr-2" />
                  Appointment Recording
                </h3>
                <button
                  onClick={closeVideoModal}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-1 bg-black">
                <video
                  src={videoModal.url}
                  controls
                  className="w-full aspect-video"
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-4 bg-gray-50">
                <p className="text-gray-600 text-sm">
                  This recording is provided for your personal reference. Please do not share this video with others without appropriate consent.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 pt-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl border shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Calendar className="h-8 w-8 text-white" />
              My Healthcare Journey
            </h2>
            <p className="mt-2 text-sky-100 text-lg">Track and manage all your medical appointments in one place</p>
          </div>

          {/* Stats Section */}
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.5)" }}
                className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl shadow p-6 border border-sky-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Total Appointments</h3>
                    <p className="text-4xl font-bold text-sky-600 mt-2">{appointments.length}</p>
                  </div>
                  <div className="bg-sky-200 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-sky-600" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.5)" }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow p-6 border border-green-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Upcoming</h3>
                    <p className="text-4xl font-bold text-green-600 mt-2">
                      {appointments.filter(a => {
                        const appointmentDate = new Date(a.appointmentDate);
                        const [hours, minutes] = a.slot.split(':').map(Number);
                        appointmentDate.setHours(hours, minutes, 0, 0);
                        return appointmentDate > new Date();
                      }).length}
                    </p>
                  </div>
                  <div className="bg-green-200 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(147, 51, 234, 0.5)" }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow p-6 border border-purple-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
                    <p className="text-4xl font-bold text-purple-600 mt-2">
                      {appointments.filter(a => {
                        const appointmentDate = new Date(a.appointmentDate);
                        const [hours, minutes] = a.slot.split(':').map(Number);
                        appointmentDate.setHours(hours, minutes, 0, 0);
                        return appointmentDate <= new Date();
                      }).length}
                    </p>
                  </div>
                  <div className="bg-purple-200 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-base text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                  placeholder="Search by doctor name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex bg-gray-200 p-1 rounded-lg self-start">
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`px-5 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    activeTab === "upcoming" 
                      ? "bg-white text-sky-600 shadow-sm" 
                      : "text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={`px-5 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    activeTab === "past" 
                      ? "bg-white text-sky-600 shadow-sm" 
                      : "text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  Past
                </button>
              </div>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent"></div>
                <p className="mt-4 text-lg text-gray-600">Loading your appointments...</p>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="overflow-x-auto rounded-lg shadow">
                <table className="w-full">
                  <thead>
                    <tr className="bg-sky-50 border-b border-sky-100">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">#</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center">
                          Doctor
                          <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center">
                          Date & Time
                          <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Specialty</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredAppointments.map((appointment, index) => (
                        <motion.tr 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-sky-50 transition-colors"
                        >
                          <td className="px-6 py-5 whitespace-nowrap text-base text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              {appointment.doctorProfile ? (
                                <img 
                                  src={appointment.doctorProfile} 
                                  alt={appointment.doctorName} 
                                  className="h-12 w-12 rounded-full object-cover border-2 border-sky-100"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                                  <User className="h-6 w-6" />
                                </div>
                              )}
                              <div className="ml-4">
                                <p className="text-base font-semibold text-gray-900">Dr. {appointment.doctorName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div>
                              <div className="flex items-center mb-1">
                                <Calendar className="h-4 w-4 text-sky-500 mr-2" />
                                <span className="text-base text-gray-700">
                                  {formatDate(appointment.appointmentDate)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-sky-500 mr-2" />
                                <span className="text-base text-gray-700">
                                  {formatTime(appointment.slot)} - {formatTime(appointment.endTime)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-sky-500 mr-2" />
                              <span className="text-base text-gray-700">
                                {appointment.speciality}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`inline-flex text-sm font-medium px-3 py-1.5 rounded-full ${getStatusColor(appointment.appointmentDate, appointment.slot)}`}>
                              {getStatusText(appointment.appointmentDate, appointment.slot)}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <NavLink to={`/Doctors/${appointment.doctorId}`}>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex items-center px-3 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors hover:bg-sky-700"
                                >
                                  <UserRound className="h-4 w-4 mr-1" />
                                  View Doctor
                                </motion.button>
                              </NavLink>

                              {appointment.videoUrl && (
                                <motion.button
                                  onClick={() => openVideoModal(appointment.videoUrl)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors hover:bg-purple-700"
                                >
                                  <PlayCircle className="h-4 w-4 mr-1" />
                                  View Recording
                                </motion.button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="h-24 w-24 mx-auto bg-sky-50 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-12 w-12 text-sky-400" />
                </div>
                <h3 className="mt-6 text-gray-800 text-xl font-semibold">No {activeTab} appointments found</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                  {searchQuery 
                    ? "Try changing your search criteria" 
                    : activeTab === "upcoming" 
                      ? "You don't have any upcoming appointments scheduled. Would you like to book an appointment with a doctor?" 
                      : "You haven't had any past appointments yet."}
                </p>

                {activeTab === "upcoming" && !searchQuery && (

                  <NavLink to = "/Doctors">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-lg font-medium transition-colors hover:bg-sky-700"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Book Appointment
                  </motion.button>
                  </NavLink>
                )}
              </motion.div>
            )}
          </div>

          {/* Health Tips Section */}
          {filteredAppointments.length > 0 && (
            <div className="p-6 bg-gradient-to-r from-sky-50 to-sky-100 border-t border-sky-100">
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-red-500 mr-2" />
                <h3 className="text-xl font-bold text-gray-800">Health Tips</h3>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-sky-100"
              >
                <p className="text-gray-700">
                  Remember to prepare for your upcoming appointment by noting down any symptoms, questions, 
                  or concerns you'd like to discuss with your doctor. Staying hydrated and getting adequate 
                  rest before your appointment can also help ensure a productive consultation.
                </p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
    </>
  );
};

export default PatientAppointments;