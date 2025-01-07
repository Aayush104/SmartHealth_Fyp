import React from 'react';
import logo from '../../Assets/Image/Logo.png';
import { IoIosNotifications } from "react-icons/io";
import { FaRegMessage } from "react-icons/fa6";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { AiOutlineProfile } from "react-icons/ai";
import { IoIosAddCircleOutline } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { MdEventAvailable } from "react-icons/md";
import Cookies from 'js-cookie';

const DoctorNav = ({ onProfileClick, onAdditionalClick, onAvailabilityClick }) => {
  const handleLogout = () => {
    Cookies.remove("Token");
    window.location.href = "/";
  };


  
  const token = Cookies.get("Token");
  const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : {};
  const userName = decodedToken.Name || "Doctor";

  return (
    <nav className="px-8 py-2 flex justify-between items-center bg-white shadow-md z-50">
      <img src={logo} alt="Medical Logo" className="w-36 cursor-pointer" />
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-8">
          {/* Notifications Icon with Text */}
          <li className="flex flex-col justify-center items-center cursor-pointer text-gray-500 font-medium group hover:text-sky-400">
            <IoIosNotifications className="text-3xl mt-1 group-hover:text-sky-400" />
            <span className="mt-1">Notifications</span>
          </li>

          {/* Messages Icon with Text */}
          <li className="flex flex-col justify-center items-center cursor-pointer text-gray-500 font-medium group hover:text-sky-400">
            <FaRegMessage className="text-2xl mt-1.5 group-hover:text-sky-400" />
            <span className="mt-1">Messages</span>
          </li>

          {/* Availability Icon with Text */}
          <li className="flex flex-col justify-center items-center cursor-pointer text-gray-500 font-medium group hover:text-sky-400" onClick={onAvailabilityClick}>
            <MdEventAvailable className="text-2xl mt-1.5 group-hover:text-sky-400" />
            <span className="mt-1">Add Availability</span>
          </li>
        </div>

        {/* Profile Dropdown */}
        <div className="relative group">
          <div className="flex items-center justify-between cursor-pointer">
            <img
              src="https://png.pngtree.com/png-vector/20230928/ourmid/pngtree-young-afro-professional-doctor-png-image_10148632.png"
              className="h-12 w-12 rounded-full object-cover"
              alt="Doctor Avatar"
            />
            <p className="text-sky-400 font-medium ml-2 capitalize">Dr. {userName}</p>
            <MdOutlineArrowDropDown className="text-2xl text-gray-500" />
          </div>
          <ul className="absolute right-0 w-48 bg-white border rounded-lg shadow-lg hidden group-hover:block">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={onProfileClick}>
              <AiOutlineProfile className="text-gray-400" /> Complete Profile
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={onAdditionalClick}>
              <IoIosAddCircleOutline className="text-gray-400" /> Additional Profile
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={handleLogout}>
              <TbLogout2 className="text-gray-400" /> Logout
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNav;


// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { 
//   Camera, 
//   Save, 
//   Edit2, 
//   Clock, 
//   MapPin, 
//   Phone, 
//   Mail, 
//   Award, 
//   Bell, 
//   MessageSquare,
//   Calendar,
//   ChevronDown,
//   UserCircle,
//   PlusCircle,
//   LogOut
// } from 'lucide-react';

// const DoctorProfileSystem = () => {
//   const [activeSection, setActiveSection] = useState('profile');
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileData, setProfileData] = useState({
//     name: "Dr. Sarah Johnson",
//     title: "MD, FACC",
//     specialty: "Cardiologist",
//     email: "dr.johnson@hospital.com",
//     phone: "(555) 123-4567",
//     office: "Medical Center, Suite 304",
//     workingHours: "Mon-Fri, 9:00 AM - 5:00 PM",
//     consultationFee: "$200",
//     education: [
//       "MD - Stanford University",
//       "Residency - Mayo Clinic",
//       "Fellowship - Cleveland Clinic"
//     ],
//     certifications: [
//       "American Board of Internal Medicine",
//       "Cardiovascular Disease Certification"
//     ],
//     languages: ["English", "Spanish"],
//     bio: "Experienced cardiologist with 15 years of practice specializing in preventive cardiology."
//   });

//   // Navigation Component
//   const DoctorNav = ({ onProfileClick, onAdditionalClick, onAvailabilityClick }) => {
//     const handleLogout = () => {
//       // Using native browser functionality instead of js-cookie
//       document.cookie = "Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//       window.location.href = "/";
//     };

//     // Parse token from cookies without using js-cookie
//     const getCookie = name => {
//       const value = `; ${document.cookie}`;
//       const parts = value.split(`; ${name}=`);
//       if (parts.length === 2) return parts.pop().split(';').shift();
//     };

//     const token = getCookie("Token");
//     const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : {};
//     const userName = decodedToken.Name || "Doctor";

//     return (
//       <nav className="px-8 py-2 flex justify-between items-center bg-white shadow-md z-50">
//         <div className="w-36 h-12 bg-gray-200 rounded cursor-pointer" /> {/* Placeholder for logo */}
//         <div className="flex items-center gap-8">
//           <div className="flex items-center gap-8">
//             <li className="flex flex-col justify-center items-center cursor-pointer text-gray-500 font-medium group hover:text-sky-400">
//               <Bell className="h-6 w-6 mt-1 group-hover:text-sky-400" />
//               <span className="mt-1">Notifications</span>
//             </li>

//             <li className="flex flex-col justify-center items-center cursor-pointer text-gray-500 font-medium group hover:text-sky-400">
//               <MessageSquare className="h-6 w-6 mt-1.5 group-hover:text-sky-400" />
//               <span className="mt-1">Messages</span>
//             </li>

//             <li className="flex flex-col justify-center items-center cursor-pointer text-gray-500 font-medium group hover:text-sky-400" onClick={onAvailabilityClick}>
//               <Calendar className="h-6 w-6 mt-1.5 group-hover:text-sky-400" />
//               <span className="mt-1">Add Availability</span>
//             </li>
//           </div>

//           <div className="relative group">
//             <div className="flex items-center justify-between cursor-pointer">
//               <img
//                 src="/api/placeholder/48/48"
//                 className="h-12 w-12 rounded-full object-cover"
//                 alt="Doctor Avatar"
//               />
//               <p className="text-sky-400 font-medium ml-2 capitalize">Dr. {userName}</p>
//               <ChevronDown className="h-6 w-6 text-gray-500" />
//             </div>
//             <ul className="absolute right-0 w-48 bg-white border rounded-lg shadow-lg hidden group-hover:block">
//               <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => setActiveSection('profile')}>
//                 <UserCircle className="h-4 w-4 text-gray-400" /> Complete Profile
//               </li>
//               <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={() => setActiveSection('additional')}>
//                 <PlusCircle className="h-4 w-4 text-gray-400" /> Additional Profile
//               </li>
//               <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={handleLogout}>
//                 <LogOut className="h-4 w-4 text-gray-400" /> Logout
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//     );
//   };

//   // Rest of the components remain the same as in the previous version
//   // ProfileContent, AdditionalContent, and other components...
  
//   // Profile Content Component
//   const ProfileContent = () => (
//     <div className="max-w-4xl mx-auto space-y-6 p-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">My Profile</h1>
//         <button
//           onClick={() => isEditing ? handleSave() : setIsEditing(true)}
//           className={`flex items-center px-4 py-2 rounded-lg ${
//             isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-sky-400 hover:bg-sky-500'
//           } text-white transition-colors`}
//         >
//           {isEditing ? (
//             <>
//               <Save className="w-4 h-4 mr-2" />
//               Save Changes
//             </>
//           ) : (
//             <>
//               <Edit2 className="w-4 h-4 mr-2" />
//               Edit Profile
//             </>
//           )}
//         </button>
//       </div>

//       <Card>
//         <CardContent className="p-6">
//           <div className="flex items-center space-x-6">
//             <div className="relative">
//               <img
//                 src="/api/placeholder/128/128"
//                 alt="Profile"
//                 className="w-32 h-32 rounded-full object-cover"
//               />
//               {isEditing && (
//                 <button className="absolute bottom-0 right-0 bg-sky-400 p-2 rounded-full text-white hover:bg-sky-500">
//                   <Camera className="w-4 h-4" />
//                 </button>
//               )}
//             </div>
//             <div className="space-y-2">
//               <input
//                 type="text"
//                 value={profileData.name}
//                 onChange={(e) => setProfileData({...profileData, name: e.target.value})}
//                 disabled={!isEditing}
//                 className="text-2xl font-bold bg-transparent border-b border-transparent focus:border-sky-400 focus:outline-none disabled:border-transparent w-full"
//               />
//               <input
//                 type="text"
//                 value={profileData.title}
//                 onChange={(e) => setProfileData({...profileData, title: e.target.value})}
//                 disabled={!isEditing}
//                 className="text-gray-600 bg-transparent border-b border-transparent focus:border-sky-400 focus:outline-none disabled:border-transparent w-full"
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Basic Information */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Basic Information</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm text-gray-600">Specialty</label>
//               <input
//                 type="text"
//                 value={profileData.specialty}
//                 onChange={(e) => setProfileData({...profileData, specialty: e.target.value})}
//                 disabled={!isEditing}
//                 className="w-full p-2 border rounded-lg disabled:bg-gray-50"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm text-gray-600">Consultation Fee</label>
//               <input
//                 type="text"
//                 value={profileData.consultationFee}
//                 onChange={(e) => setProfileData({...profileData, consultationFee: e.target.value})}
//                 disabled={!isEditing}
//                 className="w-full p-2 border rounded-lg disabled:bg-gray-50"
//               />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm text-gray-600">Bio</label>
//             <textarea
//               value={profileData.bio}
//               onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
//               disabled={!isEditing}
//               rows={4}
//               className="w-full p-2 border rounded-lg disabled:bg-gray-50 resize-none"
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Contact Information */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Contact Information</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex items-center space-x-2">
//               <Mail className="w-4 h-4 text-gray-500" />
//               <input
//                 type="email"
//                 value={profileData.email}
//                 onChange={(e) => setProfileData({...profileData, email: e.target.value})}
//                 disabled={!isEditing}
//                 className="flex-1 p-2 border rounded-lg disabled:bg-gray-50"
//               />
//             </div>
//             <div className="flex items-center space-x-2">
//               <Phone className="w-4 h-4 text-gray-500" />
//               <input
//                 type="tel"
//                 value={profileData.phone}
//                 onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
//                 disabled={!isEditing}
//                 className="flex-1 p-2 border rounded-lg disabled:bg-gray-50"
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Qualifications */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Qualifications</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="space-y-4">
//             <label className="text-sm text-gray-600">Education</label>
//             {profileData.education.map((edu, index) => (
//               <div key={index} className="flex items-center space-x-2">
//                 <Award className="w-4 h-4 text-gray-500" />
//                 <input
//                   type="text"
//                   value={edu}
//                   onChange={(e) => {
//                     const newEducation = [...profileData.education];
//                     newEducation[index] = e.target.value;
//                     setProfileData({...profileData, education: newEducation});
//                   }}
//                   disabled={!isEditing}
//                   className="flex-1 p-2 border rounded-lg disabled:bg-gray-50"
//                 />
//                 {isEditing && (
//                   <button className="text-red-500 hover:text-red-700">Remove</button>
//                 )}
//               </div>
//             ))}
//             {isEditing && (
//               <button className="text-sky-400 hover:text-sky-500">+ Add Education</button>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );

//   // Additional Profile Content Component
//   const AdditionalContent = () => (
//     <div className="max-w-4xl mx-auto p-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Additional Information</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p>Additional profile content goes here...</p>
//         </CardContent>
//       </Card>
//     </div>
//   );

//   const handleSave = () => {
//     setIsEditing(false);
//     // Here you would typically save to backend
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <DoctorNav
//         onProfileClick={() => setActiveSection('profile')}
//         onAdditionalClick={() => setActiveSection('additional')}
//         onAvailabilityClick={() => setActiveSection('availability')}
//       />
//       {activeSection === 'profile' && <ProfileContent />}
//       {activeSection === 'additional' && <AdditionalContent />}
//       {activeSection === 'availability' && (
//         <div className="max-w-4xl mx-auto p-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Availability Management</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p>Availability management content goes here...</p>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DoctorProfileSystem;