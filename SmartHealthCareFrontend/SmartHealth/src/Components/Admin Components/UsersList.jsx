import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiUserCheck, FiRefreshCw, FiSearch, FiEye, FiLock, FiUnlock } from 'react-icons/fi';
import { HiOutlineOfficeBuilding, HiOutlineUserCircle } from 'react-icons/hi';

const UsersList = () => {
  const [activeTab, setActiveTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchDoctors();
    } else if (activeTab === 'patients') {
      fetchPatients();
    }
  }, [activeTab]);

  const showTemporaryNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://localhost:7070/api/Admin/GetDoctors');
      const data = await response.json();
      
      if (data.$values) {
        const doctorsWithBlockStatus = data.$values.map(doctor => ({
          ...doctor,
          isBlocked: doctor.isBlocked || false
        }));
        setDoctors(doctorsWithBlockStatus);
      } else if (data.isSuccess && data.data && data.data.$values) {
        const doctorsWithBlockStatus = data.data.$values.map(doctor => ({
          ...doctor,
          isBlocked: doctor.isBlocked || false
        }));
        setDoctors(doctorsWithBlockStatus);
      } else {
        setError('Failed to fetch doctors or invalid data format');
      }
    } catch (err) {
      setError('Error fetching doctors: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://localhost:7070/api/Admin/GetUsers');
      const data = await response.json();
      
      if (data.isSuccess && data.data && data.data.$values) {
        const patientsWithBlockStatus = data.data.$values.map(patient => ({
          ...patient,
          isBlocked: patient.isBlocked || false
        }));
        setPatients(patientsWithBlockStatus);
      } else {
        setError('Failed to fetch patients or invalid data format');
      }
    } catch (err) {
      setError('Error fetching patients: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (patientId) => {
    try {
      const patientToToggle = patients.find(p => p.id === patientId);
      if (!patientToToggle) return;
      
      const endpoint = patientToToggle.isBlocked 
        ? `https://localhost:7070/api/Admin/Unblock/${patientId}` 
        : `https://localhost:7070/api/Admin/Block/${patientId}`;
      
      const response = await axios.post(endpoint);
      
      setPatients(prevPatients => 
        prevPatients.map(patient => 
          patient.id === patientId 
            ? { ...patient, isBlocked: !patient.isBlocked } 
            : patient
        )
      );

      showTemporaryNotification(
        `Patient ${patientToToggle.fullName} has been ${patientToToggle.isBlocked ? 'unblocked' : 'blocked'} successfully`
      );
    } catch (err) {
      showTemporaryNotification(`Error toggling block status: ${err.message}`, 'error');
      setError(`Error toggling block status: ${err.message}`);
    }
  };

  const handleDoctorBlockUnBlock = async (doctorId) => {
    try {
      const doctorToToggle = doctors.find(d => d.id === doctorId);
      if (!doctorToToggle) return;
      
      const endpoint = doctorToToggle.isBlocked 
        ? `https://localhost:7070/api/Admin/UnblockDoctor/${doctorId}` 
        : `https://localhost:7070/api/Admin/BlockDoctor/${doctorId}`;
      
      const response = await axios.post(endpoint);
      
      setDoctors(prevDoctors => 
        prevDoctors.map(doctor => 
          doctor.id === doctorId 
            ? { ...doctor, isBlocked: !doctor.isBlocked } 
            : doctor
        )
      );

      showTemporaryNotification(
        `Doctor ${doctorToToggle.fullName} has been ${doctorToToggle.isBlocked ? 'unblocked' : 'blocked'} successfully`
      );
    } catch (err) {
      showTemporaryNotification(`Error toggling doctor block status: ${err.message}`, 'error');
      setError(`Error toggling doctor block status: ${err.message}`);
    }
  };

  const refreshData = () => {
    if (activeTab === 'doctors') {
      fetchDoctors();
    } else {
      fetchPatients();
    }
    showTemporaryNotification('Data refreshed successfully');
  };

  const filteredDoctors = doctors.filter(doctor => 
    doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPatients = patients.filter(patient => 
    patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phoneNumber?.includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'bg-green-100 text-green-800 ring-green-600/20';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
      case 'Rejected': return 'bg-red-100 text-red-800 ring-red-600/20';
      default: return 'bg-gray-100 text-gray-800 ring-gray-600/20';
    }
  };

  const renderInitials = (name) => {
    if (!name) return 'U';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0);
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`;
  };

  return (
    <div className="bg-gradient-to-br  min-h-[70vh] h-full w-full flex flex-col">
      {/* Notification */}
      {showNotification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notificationType === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-medium flex items-center transition-all duration-300 animate-fade-in`}>
          {notificationType === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {notificationMessage}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 w-full max-w-full   mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 backdrop-blur-sm backdrop-filter  w-full flex flex-col overflow-hidden">
          {/* Header with Title and Search */}
          <div className="bg-white px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage doctors and patients in the system</p>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0 w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={refreshData}
                className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                title="Refresh data"
              >
                <FiRefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white px-6 pt-4 border-b border-gray-200">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('doctors')}
                className={`px-4 py-2.5 rounded-t-lg text-sm font-medium flex items-center transition-all duration-200 ${
                  activeTab === 'doctors'
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <HiOutlineOfficeBuilding className="h-5 w-5 mr-2" />
                Doctors
              </button>
              <button
                onClick={() => setActiveTab('patients')}
                className={`px-4 py-2.5 rounded-t-lg text-sm font-medium flex items-center transition-all duration-200 ${
                  activeTab === 'patients'
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <HiOutlineUserCircle className="h-5 w-5 mr-2" />
                Patients
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 flex-1 flex flex-col">
            {activeTab === 'doctors' ? (
              <div className="flex flex-col h-full rounded-lg">
                <div className="mb-5 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <FiUserCheck className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h2 className="ml-3 text-lg font-medium text-gray-900">All Doctors</h2>
                    <span className="ml-2 bg-gray-100 text-gray-700 py-1 px-2 rounded-full text-xs font-medium">
                      {filteredDoctors.length}
                    </span>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
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
                              Doctor Information
                            </th>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Specialty
                            </th>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Qualifications
                            </th>
                            <th scope="col" className="px-6 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredDoctors.length > 0 ? (
                            filteredDoctors.map((doctor) => (
                              <tr key={doctor.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 relative">
                                      {doctor.profileget ? (
                                        <img 
                                          src={doctor.profileget} 
                                          alt={doctor.fullName} 
                                          className="h-10 w-10 rounded-full object-cover border-2 border-indigo-200"
                                        />
                                      ) : (
                                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium">
                                          {renderInitials(doctor.fullName)}
                                        </div>
                                      )}
                                      {doctor.isBlocked && (
                                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-white"></div>
                                      )}
                                    </div>
                                  
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{doctor.fullName || 'Unknown Name'}</div>
                                      <div className="text-xs text-gray-500 flex items-center">
                                        <span className="truncate max-w-xs">{doctor.email}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 font-medium">{doctor.specialization || 'Not specified'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatusColor(doctor.status)}`}>
                                    {doctor.status || 'Unknown'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-700 max-w-xs truncate">{doctor.qualifications || 'Not specified'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end space-x-2">
                                    <button 
                                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                    >
                                      <FiEye className="h-3.5 w-3.5 mr-1" />
                                      View
                                    </button>
                                    <button 
                                      className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                                        doctor.isBlocked 
                                          ? 'text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500' 
                                          : 'text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500'
                                      } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
                                      onClick={() => handleDoctorBlockUnBlock(doctor.id)}
                                    >
                                      {doctor.isBlocked ? (
                                        <>
                                          <FiUnlock className="h-3.5 w-3.5 mr-1" />
                                          Unblock
                                        </>
                                      ) : (
                                        <>
                                          <FiLock className="h-3.5 w-3.5 mr-1" />
                                          Block
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500 bg-gray-50">
                                <div className="flex flex-col items-center">
                                  <FiUsers className="h-8 w-8 text-gray-400 mb-2" />
                                  <p className="text-gray-500 font-medium">No doctors found</p>
                                  <p className="text-gray-400 text-xs mt-1">Try adjusting your search or filters</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col h-full rounded-lg">
                <div className="mb-5 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FiUsers className="h-5 w-5 text-purple-600" />
                    </div>
                    <h2 className="ml-3 text-lg font-medium text-gray-900">All Patients</h2>
                    <span className="ml-2 bg-gray-100 text-gray-700 py-1 px-2 rounded-full text-xs font-medium">
                      {filteredPatients.length}
                    </span>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                    <p>{error}</p>
                  </div>
                ) : (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <div className="overflow-x-auto scrollbar-hide">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Patient
                            </th>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Contact
                            </th>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Address
                            </th>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Gender
                            </th>
                            <th scope="col" className="px-6 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient) => (
                              <tr key={patient.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 relative">
                                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 text-white font-medium">
                                        {renderInitials(patient.fullName)}
                                      </div>
                                      {patient.isBlocked && (
                                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-white"></div>
                                      )}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{patient.fullName || 'Unknown Name'}</div>
                                      <div className="text-xs text-gray-500">{patient.isBlocked ? 'Account Blocked' : 'Active Account'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{patient.email}</div>
                                  <div className="text-xs text-gray-500">{patient.phoneNumber || 'No phone'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 max-w-xs truncate">{patient.address || 'Not provided'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{patient.gender || 'Not specified'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button 
                                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                                      patient.isBlocked 
                                        ? 'text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500' 
                                        : 'text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
                                    onClick={() => handleToggleBlock(patient.id)}
                                  >
                                    {patient.isBlocked ? (
                                      <>
                                        <FiUnlock className="h-4 w-4 mr-1.5" />
                                        Unblock Account
                                      </>
                                    ) : (
                                      <>
                                        <FiLock className="h-4 w-4 mr-1.5" />
                                        Block Account
                                      </>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500 bg-gray-50">
                                <div className="flex flex-col items-center">
                                  <FiUsers className="h-8 w-8 text-gray-400 mb-2" />
                                  <p className="text-gray-500 font-medium">No patients found</p>
                                  <p className="text-gray-400 text-xs mt-1">Try adjusting your search or filters</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;