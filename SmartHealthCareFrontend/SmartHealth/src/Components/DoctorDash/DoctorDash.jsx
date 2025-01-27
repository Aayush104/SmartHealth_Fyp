import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DoctorDetails from '../../Pages/DoctorDetails/DoctorDetails';

const DoctorDash = ({doctorData}) => {
 
  const [greeting, setGreeting] = useState('');


console.log("doctorData", doctorData)

  var doc = doctorData?.data.doctor
  // Get current time and determine greeting
  useEffect(() => {
    const currentHour = new Date().getHours();
    let greetingMessage = '';

    if (currentHour < 12) {
      greetingMessage = 'Good Morning';
    } else if (currentHour < 18) {
      greetingMessage = 'Good Afternoon';
    } else {
      greetingMessage = 'Good Night';
    }

    setGreeting(greetingMessage);
  }
  )
   

  return (
    <div className="min-h-screen">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile and Welcome Section */}
        <div className="items-center justify-between mb-8">
          <div>
          <h3>{greeting}</h3> 
            <h2 className="text-2xl font-semibold text-gray-800">Welcome back, Dr. {doc.fullName}</h2>
           {/* Dynamic greeting based on time */}
            <p className="text-gray-600">Here's your practice overview for today</p>
          </div>
          {/* Profile Picture Section */}
          <div className="flex mt-2 items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-sky-200 overflow-hidden">
              {/* Replace the placeholder with your actual image */}
              <img 
                src={doc.profileget} 
                alt="Doctor Profile" 
                className="w-20 h-20 object-cover" 
              />
            </div>
            <div>
              <div className="text-lg font-medium">Dr. {doc.fullName}</div>
              <div className="text-sm text-gray-500">{doc.specialization}</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Static content replacing the dynamic mapping */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Appointments</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">25</h3>
              </div>
              <span className="text-green-500 text-sm font-medium">+5</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Confirmed Appointments</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">20</h3>
              </div>
              <span className="text-green-500 text-sm font-medium">+2</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Video Consultations</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">10</h3>
              </div>
              <span className="text-green-500 text-sm font-medium">+3</span>
            </div>
          </div>
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Appointments Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Today's Appointments</h3>
                <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                  Start Next Consultation
                </button>
              </div>
              
              {/* Static Content for Appointments */}
              <div className="space-y-4">
                <div className="border border-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-800">John Doe</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">10:00 AM</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-sm px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                          Video Consultation
                        </span>
                      </div>
                    </div>
                    <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Symptoms:</span> Chest pain, shortness of breath
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions and Schedule */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Start Video Call', 'View Schedule', 'Patient Records', 'Write Prescription'].map((action, index) => (
                  <button
                    key={index}
                    className="p-4 rounded-lg bg-sky-50 hover:bg-sky-100 transition-colors text-sm text-sky-700 font-medium text-center"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

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
    </div>
  );
};

export default DoctorDash;
