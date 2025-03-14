import React, { useState } from 'react';

const UsersList = () => {
  const [activeTab, setActiveTab] = useState('doctors');

  // Static data
  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', patients: 42, rating: 4.8 },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Neurology', patients: 38, rating: 4.7 },
    { id: 3, name: 'Dr. James Wilson', specialty: 'Orthopedics', patients: 45, rating: 4.9 },
    { id: 4, name: 'Dr. Emily Rodriguez', specialty: 'Pediatrics', patients: 52, rating: 4.6 },
    { id: 5, name: 'Dr. Robert Thompson', specialty: 'Oncology', patients: 36, rating: 4.8 },
    // Add more doctors for demonstration
    { id: 6, name: 'Dr. Lisa Brown', specialty: 'Dermatology', patients: 39, rating: 4.5 },
    { id: 7, name: 'Dr. David Lee', specialty: 'Gastroenterology', patients: 41, rating: 4.7 },
    { id: 8, name: 'Dr. Amanda Miller', specialty: 'Endocrinology', patients: 37, rating: 4.6 },
  ];

  const patients = [
    { id: 101, name: 'John Smith', age: 45, lastVisit: '2025-03-10', doctor: 'Dr. Sarah Johnson' },
    { id: 102, name: 'Maria Garcia', age: 32, lastVisit: '2025-03-12', doctor: 'Dr. Emily Rodriguez' },
    { id: 103, name: 'David Brown', age: 58, lastVisit: '2025-03-08', doctor: 'Dr. James Wilson' },
    { id: 104, name: 'Sophia Lee', age: 27, lastVisit: '2025-03-11', doctor: 'Dr. Michael Chen' },
    { id: 105, name: 'Omar Patel', age: 63, lastVisit: '2025-03-09', doctor: 'Dr. Robert Thompson' },
    { id: 106, name: 'Emma Wilson', age: 7, lastVisit: '2025-03-13', doctor: 'Dr. Emily Rodriguez' },
    // Add more patients for demonstration
    { id: 107, name: 'Michael Johnson', age: 52, lastVisit: '2025-03-07', doctor: 'Dr. Lisa Brown' },
    { id: 108, name: 'Sarah Thompson', age: 29, lastVisit: '2025-03-06', doctor: 'Dr. David Lee' },
    { id: 109, name: 'James Rodriguez', age: 41, lastVisit: '2025-03-05', doctor: 'Dr. Amanda Miller' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen h-full w-full flex flex-col">
      

      {/* Main Content */}
      <div className="flex-1 w-full max-w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow h-full w-full flex flex-col">
          {/* Tab Navigation - Fixed */}
          <div className="border-b border-gray-200 bg-white z-10">
            <nav className="flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('doctors')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'doctors'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Doctors
              </button>
              <button
                onClick={() => setActiveTab('patients')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'patients'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Patients
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-4 flex-1 flex flex-col">
            {activeTab === 'doctors' ? (
              <div className="flex flex-col h-full">
                <div className="mb-5 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">All Doctors</h2>
                </div>

                {/* Scrollable area for table - with hidden scrollbar */}
                <div className="overflow-y-auto scrollbar-hide flex-1">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Specialty
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patients
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {doctors.map((doctor) => (
                        <tr key={doctor.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-800 font-medium">{doctor.name.charAt(0)}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{doctor.specialty}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{doctor.patients}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900 mr-2">{doctor.rating}</span>
                              <div className="text-yellow-400">★★★★★</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="mb-5 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">All Patients</h2>
                </div>

                {/* Scrollable area for table - with hidden scrollbar */}
                <div className="overflow-y-auto scrollbar-hide flex-1">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Age
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Visit
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned Doctor
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-800 font-medium">{patient.name.charAt(0)}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                                <div className="text-sm text-gray-500">#{patient.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{patient.age}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{patient.lastVisit}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{patient.doctor}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                            <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;