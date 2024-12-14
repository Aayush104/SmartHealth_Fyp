import React, { useState } from 'react';
import Otp from '../../Components/Otp/Otp';
import Navbar from '../../Components/Navbar/Navbar';
import Helper from '../../Components/Helper/Helper';
import Footer from '../../Components/Fotter/Fotter';
import useStore from '../../Zustand/Store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

const PatientRegistration = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  const registerPatient = useStore((state) => state.registerPatient);
  const [showPassword, setShowPassword] = useState(false);
  
    const handlePasswordToggle = () => {
      setShowPassword(!showPassword);
    };

 

  const handleSubmit = async (e) => {
    e.preventDefault();



    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true); // Start loading animation

    try {
      const formData = {
        fullName,
        email,

        password,
        dateOfBirth,
        medicalHistory,
      };

      const response = await registerPatient(formData);

      // Simulate loading delay before displaying OTP or error
      setTimeout(() => {
        if (response) {

            setSuccess(true);
          
          setUserId(response);
       
          toast.success("Registration successful! Please verify your OTP.");
        } else {
          toast.error("Failed to register. Please try again.");
        }
        setLoading(false);
      }, 3000);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Show loader for 3 seconds if 401 error occurs
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } else {
        console.error("Error registering patient:", error);
        toast.error(error.message || "Failed to register. Please try again.");
        setLoading(false);
      }
    }
  };

  const handleNavigate = () => {
    navigateTo('/doctorRegistration');
  };

  return (
    <div>
      <Navbar />
      {loading ? (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white z-10">
          <div>
            <iframe
              src="https://lottie.host/embed/f0c76f96-a6b9-4b55-ad52-a3dc62715955/2imxSkN9Vh.json"
              width="250"
              height="250"
            />
            <p className="text-center text-sky-500 text-2xl">Please Wait....</p>
          </div>
        </div>
      ) : success ? (
        <Otp userId={userId} Purpose="Registration" />
      ) : (
        <>
        
          <Helper />
          <div className="w-100 mt-4 py-4">
            <div className="flex justify-around items-center px-4 h-min-screen">
              <img
                src="https://img.freepik.com/premium-vector/patient-doctor-are-talking-office-health-medicine_824539-238.jpg"
                alt="Healthcare illustration"
                className="w-6/12"
              />
              <div className="flex justify-center items-center">
                <form
                  onSubmit={handleSubmit}
                  className="bg-white shadow-md rounded px-6 pt-6 pb-8 mb-4 w-full max-w-xl"
                >
                  <div className="flex items-center justify-between mb-4 pb-2 border-b">
                    <p className="text-lg font-semibold text-gray-500">Join Smart Health</p>
                    <p className="text-[15px] text-gray-500">
                      Are you a doctor?{" "}
                      <span
                        className="text-blue-400 text-[13px] cursor-pointer hover:underline"
                        onClick={handleNavigate}
                      >
                        Register Here
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center justify-between gap-4 w-full">
                      <div className="mb-4 w-full">
                        <label className="text-gray-700 text-sm mb-2" htmlFor="fullName">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4 w-full">
                        <label className="text-gray-700 text-sm mb-2" htmlFor="email">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 w-full">

                      <div className="mb-4 w-full">
                        <label className="text-gray-700 text-sm mb-2" htmlFor="dateOfBirth">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="dateOfBirth"
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          required
                          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mb-4 w-full relative">
                      <label className="text-gray-700 text-sm mb-2" htmlFor="password">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                         <span
                                                        onClick={handlePasswordToggle}
                                                        className="absolute right-3 top-11 transform -translate-y-1/2 cursor-pointer text-gray-600"
                                                      >
                                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                      </span>
                      
                    </div>

                    <div className="mb-4 w-full">
                      <label className="text-gray-700 text-sm mb-2" htmlFor="medicalHistory">
                        Medical History <span className="text-red-500">(optional)</span>
                      </label>
                      <textarea
                        id="medicalHistory"
                        value={medicalHistory}
                        onChange={(e) => setMedicalHistory(e.target.value)}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default PatientRegistration;
