import React, { useEffect, useState } from "react";
import DoctorNav from "../../Components/Navbar/DoctorNav";
import Footer from "../../Components/Fotter/Fotter";
import axios from "axios";
import Cookies from "js-cookie";
import { Calendar, Clock, User, AlertCircle, CheckCircle, Search, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const token = Cookies.get("Token");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://localhost:7070/api/Appointment/GetAppointmentList",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Appointments Data", response.data.data);
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      if (tabType === "upcoming") {
        return appointmentDate >= today;
      } else {
        return appointmentDate < today;
      }
    });

    // Apply search filter if query exists
    if (query.trim() !== "") {
      filtered = filtered.filter(appointment => 
        appointment.patientFullName.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      return tabType === "upcoming" ? dateA - dateB : dateB - dateA;
    });

    setFilteredAppointments(filtered);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'booked':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-slate-50">
     
      <div className="container mx-auto px-4 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              Appointments Dashboard
            </h2>
            <p className="mt-2 text-gray-600 text-lg">View your upcoming and past patient appointments</p>
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-base text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by patient name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              
              <div className="flex bg-gray-200 p-1 rounded-lg self-start">
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`px-5 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    activeTab === "upcoming" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={`px-5 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    activeTab === "past" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  Past
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h3 className="text-lg font-semibold text-gray-700">Total Appointments</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{appointments.length}</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h3 className="text-lg font-semibold text-gray-700">Upcoming</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {appointments.filter(a => new Date(a.appointmentDate) >= new Date()).length}
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {appointments.filter(a => new Date(a.appointmentDate) < new Date()).length}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-lg text-gray-600">Loading appointments...</p>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">#</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center">
                          Patient 
                          <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredAppointments.map((appointment, index) => (
                        <motion.tr 
                          key={appointment.appointmentId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-5 whitespace-nowrap text-base text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                                <User className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="text-base font-semibold text-gray-900">
                                  {appointment.patientFullName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ID: {appointment.appointmentId}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                              <span className="text-base text-gray-700 font-medium">
                                {formatDate(appointment.appointmentDate)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-blue-500 mr-2" />
                              <span className="text-base text-gray-700">
                                {appointment.slot}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`inline-flex text-sm font-medium px-3 py-1.5 rounded-full ${getPaymentStatusColor(appointment.paymentStatus)}`}>
                              {appointment.paymentStatus === "Paid" ? (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              ) : null}
                              {appointment.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`inline-flex text-sm font-medium px-3 py-1.5 rounded-full ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
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
                <div className="h-24 w-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-12 w-12 text-gray-400" />
                </div>
                <p className="mt-6 text-gray-600 text-xl">No {activeTab} appointments found</p>
                <p className="mt-2 text-gray-500">
                  {searchQuery 
                    ? "Try changing your search criteria" 
                    : `You don't have any ${activeTab} appointments at the moment`}
                </p>
              </motion.div>
            )}
          </div>

      
         
        </motion.div>
      </div>
     <Footer />
    </div>
  );
};

export default DoctorAppointments;