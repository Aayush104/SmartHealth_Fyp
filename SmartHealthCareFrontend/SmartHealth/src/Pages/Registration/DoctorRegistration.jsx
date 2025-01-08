import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Navbar/Navbar';
import Helper from '../../Components/Helper/Helper';
import specializations from '../../Assets/Data/Speciality.json'; // Importing specialization data
import locations from '../../Assets/Data/Location.json'; // Importing specialization data
import Footer from '../../Components/Fotter/Fotter';
import { NavLink, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { AiFillFileAdd } from "react-icons/ai";
import useStore from '../../Zustand/Store';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Spinner } from '@chakra-ui/react';

const DoctorRegistration = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [location, setLocation] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [licenseFile, setLicenseFile] = useState(null);
  const [qualificationsFile, setQualificationsFile] = useState(null);
  const [governmentIdFile, setGovernmentIdFile] = useState(null);
  const [licenseFileUrl, setLicenseFileUrl] = useState(null);
  const [qualificationsFileUrl, setQualificationsFileUrl] = useState(null);
  const [governmentIdFileUrl, setGovernmentIdFileUrl] = useState(null);
  const [success,setSuccess] = useState(false);
  const registerDoctor = useStore((state) => state.registerDoctor);
  const [showPassword, setShowPassword] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const formData = new FormData();

    formData.append('FullName', fullName);
    formData.append('Email', email);
    formData.append('Password', password);
    formData.append('Specialization', specialization);
    formData.append('Location', location);
    formData.append('LicenseNumber', licenseNumber);
    formData.append('Qualifications', qualifications);

    if (licenseFile) formData.append('LicenseFile', licenseFile);
    if (qualificationsFile) formData.append('QualificationsFile', qualificationsFile);
    if (governmentIdFile) formData.append('GovernmentIdFile', governmentIdFile);

    if (!fullName || !email  || !password || !specialization || !location  || !licenseFile || !qualificationsFile || !governmentIdFile || !qualifications) {
      toast.error("All fields are required.");
      return
    }

    const panRegex = /^\d{9}$/;

    if (!panRegex.test(licenseNumber)) {
      toast.error("Invalid Pan number format.");
      return;
    }


    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
     const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialCharRegex.test(password)) {
          toast.error("Password must have at least one special character.");
          return;
        }

    setIsSubmitting(true);
    try {
      const response = await registerDoctor(formData);

      if (response) {
       
        setSuccess(true)
       setFullName('');
       setEmail('');
       setGovernmentIdFile(null);
       setLicenseFile(null);
       setPassword('');
      setLocation('');
       setQualificationsFile('')
       setQualifications('');
       setSpecialization(null)
       setLicenseNumber('')
       setGovernmentIdFileUrl(null);
       setQualificationsFileUrl(null);
       setLicenseFileUrl(null);
       

      }

    } catch (error) {
      console.error("Error registering patient:", error);
      toast.error(error.message || "Failed to register. Please try again.");
    } finally {
      setIsSubmitting(false); // Ensure the spinner stops
    }
  };


  const handleLicenseFileChange = (e) => {
    const file = e.target.files[0];
    setLicenseFile(file);
    if (file) {
      setLicenseFileUrl(URL.createObjectURL(file));
    }
  };

  const handleQualificationsFileChange = (e) => {
    const file = e.target.files[0];
    setQualificationsFile(file);
    if (file) {
      setQualificationsFileUrl(URL.createObjectURL(file));
    }
  };

  const handleGovernmentIdFileChange = (e) => {
    const file = e.target.files[0];
    setGovernmentIdFile(file);
    if (file) {
      setGovernmentIdFileUrl(URL.createObjectURL(file));
    }
  };


  return (
    <>
  {
    isSubmitting && (
 <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </div>
    )
  } 

    { 
      success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="shadow-lg w-80 rounded-lg bg-white px-6 py-4 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Sent For Verification</h3>
            <p className="text-gray-600 mb-6">
              We will sent you the verification details! Our team will reach out to you soon.
            </p>
            <button 

onClick={() => setSuccess(false)}
              
              className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-2 rounded-md transition duration-200"
            >
              OK
            </button>
          </div>
        </div>
      )
    }

    <div className={`${success ? 'blur-sm' : ''}`}>
      <Navbar />
      <Helper />

     
      
      <div className="w-100 mt-4 py-4">
   
        <div className="flex justify-around items-center px-4 h-min-screen">
          <img
            src="https://img.freepik.com/free-vector/illustrated-doctor-injecting-vaccine-patient_23-2148828856.jpg"
            alt="Healthcare illustration"
            className="w-5/8"
          />

          <div className="flex justify-center items-center">
      

            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md px-6 pt-6 pb-8 rounded-xl mb-4 w-full max-w-xl"
            >
              <div className='flex items-center justify-between mb-4 pb-2 border-b'>
                <p className="text-lg font-semibold text-gray-500">Join Smart Health</p>
                <p className='text-[15px] text-gray-500'>
                  Not a doctor?{" "}
                  <NavLink to='/patientRegistration'>
                    <span className="text-blue-400 text-[13px] cursor-pointer hover:underline">
                      Register Here
                    </span>
                  </NavLink>
                </p>
              </div>

             

              <div className="flex flex-wrap gap-4">
                <div className='flex gap-4'>
                  <div className='mb-4 w-full'>
                    <label className="text-gray-700 text-sm mb-2" htmlFor="fullName">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 h-12"
                    />
                  </div>

                  <div className='mb-4 w-full'>
                    <label className="text-gray-700 text-sm mb-2" htmlFor="fullName">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 h-12"
                    />
                  </div>
                </div>

                <div className='flex gap-4'>
                  
                <div className='mb-4 w-full'>
                    <label className="text-gray-700 text-sm mb-2" htmlFor="fullName">
                      Qualifications <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={qualifications}
                      onChange={(e) => setQualifications(e.target.value)}
                      className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 h-12"
                    />
                  </div>
                  <div className='mb-4 w-full'>
                    <label className="text-gray-700 text-sm mb-2" htmlFor="fullName">
                      Pan Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 h-12"
                    />
                  </div>
                </div>

<div className='flex gap-4'>
               
                  <div className='mb-4 w-full shadow'>
                    <label className="text-gray-700 text-sm mb-2" htmlFor="fullName">
                      Specialization<span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={specializations.map((spec) => ({ value: spec.name, label: spec.name }))}
                      onChange={(selectedOption) => setSpecialization(selectedOption.value)}
                      placeholder="Select Specialization"
                      className=' W-full z-1'
                      styles={{
                        control: (base) => ({
                          ...base,
                          height: '48px',
                          width: "16rem",
                          minHeight: '48px',
                          border: '1px solid #d1d5db',
                          boxShadow: 'none',
                          '&:hover': {
                            border: '2px solid #3b82f6',
                          },
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          padding: 4,
                        }),
                        clearIndicator: (base) => ({
                          ...base,
                          padding: 4,
                        }),
                        multiValue: (base) => ({
                          ...base,
                          backgroundColor: '#93c5fd',
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: '#9ca3af',
                        }),
                      }}
                    />
                  </div>
                  <div className='mb-4 w-full shadow'>
                    <label className="text-gray-700 text-sm mb-2" htmlFor="fullName">
                      Location<span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={locations.map((loc) => ({ value: loc.name, label: loc.name }))}
                      onChange={(selectedOption) => setLocation(selectedOption.value)}
                      placeholder="Select Location"
                      className=' W-full z-1'
                      styles={{
                        control: (base) => ({
                          ...base,
                          height: '48px',
                          width: "16rem",
                          minHeight: '48px',
                          border: '1px solid #d1d5db',
                          boxShadow: 'none',
                          '&:hover': {
                            border: '2px solid #3b82f6',
                          },
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          padding: 4,
                        }),
                        clearIndicator: (base) => ({
                          ...base,
                          padding: 4,
                        }),
                        multiValue: (base) => ({
                          ...base,
                          backgroundColor: '#93c5fd',
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: '#9ca3af',
                        }),
                      }}
                    />
                  </div>

              </div>
              

                <div className='mb-4 w-full relative'>
                  <label className="text-gray-700 text-sm mb-2" htmlFor="fullName">
                    Password<span className="text-red-500">*</span>
                  </label>
                  <div className='flex'>                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="shadow border rounded w-full z-0 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 h-12"
                  />
                  <span
                                  onClick={handlePasswordToggle}
                                  className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer text-gray-600"
                                >
                                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                </div>

                </div>

                <div className='flex items-center justify-between gap-2 w-full '>
                  <div className='mb-4 w-full flex flex-col gap-2 '>
                    <label className="text-gray-700 text-sm mb-2" htmlFor="fullName">
                      Liscense Photo<span className="text-red-500">*</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer bg-sky-400 text-white py-2 px-4 rounded h-12">
                      <AiFillFileAdd className="mr-2 text-lg" />
                      <span>Choose file</span>
                      <input
                        type="file"
                        onChange={handleLicenseFileChange}
                        className="hidden"
                      />
                    </label>

                  </div>

                  <div className='mb-4 w-full flex flex-col gap-2 '>
                    <label className="text-gray-700 text-sm mb-2">Add Qualifications File <span className="text-red-500">*</span></label>
                    <label className="inline-flex items-center cursor-pointer bg-sky-400 text-white py-2 px-4 rounded h-12">
                      <AiFillFileAdd className="mr-2 text-lg" />
                      <span>Choose file</span>
                      <input
                        type="file"
                        onChange={handleQualificationsFileChange}
                        className="hidden"
                      />
                    </label>


                  </div>

                  <div className='mb-4 w-full flex flex-col gap-2 '>
                    <label className="text-gray-700 text-sm mb-2">Government ID<span className="text-red-500">*</span></label>
                    <label className="inline-flex items-center cursor-pointer bg-sky-400 text-white py-2 px-4 rounded h-12">
                      <AiFillFileAdd className="mr-2 text-lg" />
                      <span>Choose file</span>
                      <input
                        type="file"
                        onChange={handleGovernmentIdFileChange}
                        className="hidden"
                      />
                    </label>

                  </div>
                </div>
              </div>
              <div className='flex justify-around items-center mb-2'>
                <div>
                  {licenseFileUrl && (
                    <img src={licenseFileUrl} alt="License" className=" h-20 object-cover" />
                  )}
                </div>

                <div>
                  {qualificationsFileUrl && (
                    <img src={qualificationsFileUrl} alt="Qualifications" className="mt-1 h-20 object-cover" />
                  )}
                </div>

                <div>
                  {governmentIdFileUrl && (
                    <img src={governmentIdFileUrl} alt="Government ID" className="mt-1 h-20 object-cover" />
                  )}
                </div>

              </div>
              <button
                type="submit"
                className="mt-4 w-full h-12 text-white bg-blue-500 hover:bg-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Sign Up
              </button>


            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
};

export default DoctorRegistration;
