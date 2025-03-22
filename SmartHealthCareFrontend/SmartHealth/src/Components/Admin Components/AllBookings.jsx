import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, 
  FiClock, 
  FiDollarSign, 
  FiFilter, 
  FiRefreshCw, 
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiUsers
} from 'react-icons/fi';
import { HiOutlineClipboardCheck, HiOutlineClipboardList } from 'react-icons/hi';

const AllBookings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      categorizeAppointments();
    }
  }, [bookings]);

  const showTemporaryNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://localhost:7070/api/Admin/GetAllBookings");
      
      if (response.data.isSuccess && response.data.data && response.data.data.$values) {
        setBookings(response.data.data.$values);
        showTemporaryNotification('Appointments loaded successfully');
      } else {
        setError('Failed to fetch bookings or invalid data format');
        showTemporaryNotification('Failed to load appointments', 'error');
      }
    } catch (err) {
      setError(`Error fetching bookings: ${err.message}`);
      showTemporaryNotification(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const categorizeAppointments = () => {
    const now = new Date();
    
    const upcoming = [];
    const past = [];
    
    bookings.forEach(booking => {
      const appointmentDate = new Date(booking.appointmentDate);
      const [hours, minutes] = booking.appointmentTime.split(':').map(Number);
      appointmentDate.setHours(hours, minutes);
      
      if (appointmentDate > now) {
        upcoming.push(booking);
      } else {
        past.push(booking);
      }
    });
    
    // Sort upcoming appointments by date (closest first)
    upcoming.sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      const [hoursA, minutesA] = a.appointmentTime.split(':').map(Number);
      const [hoursB, minutesB] = b.appointmentTime.split(':').map(Number);
      dateA.setHours(hoursA, minutesA);
      dateB.setHours(hoursB, minutesB);
      return dateA - dateB;
    });
    
    // Sort past appointments by date (most recent first)
    past.sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      const [hoursA, minutesA] = a.appointmentTime.split(':').map(Number);
      const [hoursB, minutesB] = b.appointmentTime.split(':').map(Number);
      dateA.setHours(hoursA, minutesA);
      dateB.setHours(hoursB, minutesB);
      return dateB - dateA;
    });
    
    setUpcomingAppointments(upcoming);
    setPastAppointments(past);
  };

  const refreshData = () => {
    fetchBookings();
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  const getFilteredAppointments = () => {
    const appointmentsToFilter = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;
    
    return appointmentsToFilter.filter(booking => 
      booking.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.doctorSpecialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.paymentStatus?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getPaymentStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 ring-green-600/20';
      case 'pending': return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
      case 'failed': return 'bg-red-100 text-red-800 ring-red-600/20';
      case 'refunded': return 'bg-blue-100 text-blue-800 ring-blue-600/20';
      default: return 'bg-gray-100 text-gray-800 ring-gray-600/20';
    }
  };

  const filteredAppointments = getFilteredAppointments();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const tabVariants = {
    inactive: { borderColor: 'transparent' },
    active: { 
      borderColor: '#4f46e5',
      transition: { duration: 0.3 } 
    }
  };

  return (
    <div className="bg-gradient-to-br min-h-[70vh] h-full w-full flex flex-col">
      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notificationType === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white font-medium flex items-center`}
          >
            {notificationType === 'success' ? (
              <FiCheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <FiXCircle className="h-5 w-5 mr-2" />
            )}
            {notificationMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 backdrop-blur-sm backdrop-filter w-full flex flex-col overflow-hidden"
        >
          {/* Header with Title and Search */}
          <div className="bg-white px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">List Of Appointments</h1>
              <p className="text-sm text-gray-500 mt-1">View all appointments in the system</p>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0 w-full sm:w-64">
                
               
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshData}
                className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                title="Refresh data"
              >
                <FiRefreshCw className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white px-6 pt-4 border-b border-gray-200">
            <div className="flex space-x-1">
              <motion.button
                variants={tabVariants}
                initial="inactive"
                animate={activeTab === 'upcoming' ? 'active' : 'inactive'}
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2.5 rounded-t-lg text-sm font-medium flex items-center transition-all duration-200 ${
                  activeTab === 'upcoming'
                    ? 'bg-indigo-50 text-indigo-700 border-b-2'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <HiOutlineClipboardList className="h-5 w-5 mr-2" />
                Upcoming Appointments
                {upcomingAppointments.length > 0 && (
                  <span className="ml-2 bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full text-xs font-medium">
                    {upcomingAppointments.length}
                  </span>
                )}
              </motion.button>
              <motion.button
                variants={tabVariants}
                initial="inactive"
                animate={activeTab === 'past' ? 'active' : 'inactive'}
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2.5 rounded-t-lg text-sm font-medium flex items-center transition-all duration-200 ${
                  activeTab === 'past'
                    ? 'bg-indigo-50 text-indigo-700 border-b-2'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <HiOutlineClipboardCheck className="h-5 w-5 mr-2" />
                Past Appointments
                {pastAppointments.length > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs font-medium">
                    {pastAppointments.length}
                  </span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === 'upcoming' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === 'upcoming' ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full rounded-lg"
              >
                <div className="mb-5 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${activeTab === 'upcoming' ? 'bg-indigo-100' : 'bg-purple-100'}`}>
                      {activeTab === 'upcoming' ? (
                        <FiCalendar className="h-5 w-5 text-indigo-600" />
                      ) : (
                        <FiClock className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <h2 className="ml-3 text-lg font-medium text-gray-900">
                      {activeTab === 'upcoming' ? 'Upcoming Appointments' : 'Past Appointments'}
                    </h2>
                    <span className="ml-2 bg-gray-100 text-gray-700 py-1 px-2 rounded-full text-xs font-medium">
                      {filteredAppointments.length}
                    </span>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"
                    ></motion.div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                    <p>{error}</p>
                  </div>
                ) : (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Patient
                            </th>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Doctor
                            </th>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Time
                            </th>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Specialization
                            </th>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Payment Status
                            </th>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <motion.tbody
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible" 
                          className="bg-white divide-y divide-gray-200"
                        >
                          {filteredAppointments.length > 0 ? (
                            filteredAppointments.map((booking, index) => (
                              <motion.tr 
                                key={`${booking.patientName}-${booking.appointmentDate}-${booking.appointmentTime}-${index}`} 
                                variants={itemVariants}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="p-1.5 bg-indigo-100 rounded-full mr-2">
                                      <FiUser className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">{booking.patientName}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="p-1.5 bg-purple-100 rounded-full mr-2">
                                      <FiUsers className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div className="text-sm font-medium text-gray-700">Dr. {booking.doctorName}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <FiCalendar className="h-4 w-4 text-indigo-500 mr-2" />
                                    <span className="text-sm text-gray-900 font-medium">{formatDate(booking.appointmentDate)}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <FiClock className="h-4 w-4 text-indigo-500 mr-2" />
                                    <span className="text-sm text-gray-700">{formatTime(booking.appointmentTime)}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                                    {booking.doctorSpecialization}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                    {booking.paymentStatus}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                
                                    <span className="text-sm font-medium text-gray-900">Rs.{booking.paymentAmount}</span>
                                  </div>
                                </td>
                              </motion.tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500 bg-gray-50">
                                <div className="flex flex-col items-center">
                                  <FiCalendar className="h-8 w-8 text-gray-400 mb-2" />
                                  <p className="text-gray-500 font-medium">No appointments found</p>
                                  <p className="text-gray-400 text-xs mt-1">Try adjusting your search or filters</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </motion.tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AllBookings;