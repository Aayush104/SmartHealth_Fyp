import React, { useState } from 'react';
import Otp from '../../Components/Otp/Otp';
import Navbar from '../../Components/Navbar/Navbar';
import Helper from '../../Components/Helper/Helper';
import Footer from '../../Components/Fotter/Fotter';
import useStore from '../../Zustand/Store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { Spinner } from '@chakra-ui/react';

const PatientRegistration = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigateTo = useNavigate();
  const registerPatient = useStore((state) => state.registerPatient);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
      toast.error('Password must have at least one special character.');
      return;
    }

    setLoading(true);

    try {
      const formData = {
    "FullName":  fullName,
      "Email":  email,
      "Password":  password,
      "DateOfBirth":  dateOfBirth,
    "Address":    address,
    "Gender":    gender,
      "PhoneNumber":  phoneNumber,
      
      };

      const response = await registerPatient(formData);

      setTimeout(() => {
        if (response) {
          setSuccess(true);
          setUserId(response);
          toast.success('Registration successful! Please verify your OTP.');
        } else {
          toast.error('Failed to register. Please try again.');
        }
        setLoading(false);
      }, 3000);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } else {
        console.error('Error registering patient:', error);
        toast.error(error.message || 'Failed to register. Please try again.');
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
        <div className="fixed inset-0 bg-white  flex justify-center items-center z-50">
        <div className='flex flex-col justify-center items-center gap-1'>
                 <Spinner
                   thickness="4px"
                   speed="0.65s"
                   emptyColor="gray.200"
                   color="blue.500"
                   size="xl"
                 />
                 <p>Please Wait....</p>
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
                      Are you a doctor?{' '}
                      <span
                        className="text-blue-400 text-[13px] cursor-pointer hover:underline"
                        onClick={handleNavigate}
                      >
                        Register Here
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                  <div className='flex gap-4'>
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

<div className='flex gap-4'>
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
                    <div className="mb-4 w-full">
                      <label className="text-gray-700 text-sm mb-2" htmlFor="address">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    </div>

                    <div className='flex gap-4'>
                    <div className="mb-4 w-full">
                      <label className="text-gray-700 text-sm mb-2" htmlFor="gender">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="" disabled>
                          Select Gender
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mb-4 w-full">
                      <label className="text-gray-700 text-sm mb-2" htmlFor="phoneNumber">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    </div>
                  
                  </div>

                  <div className="mb-4 w-full">
                    <label className="text-gray-700 text-sm mb-2" htmlFor="password">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span
                        className="absolute top-2 right-2 text-gray-500 cursor-pointer"
                        onClick={handlePasswordToggle}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4 w-full relative">
                    <label className="text-gray-700 text-sm mb-2" htmlFor="confirmPassword">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      
                      required
                      className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      
                    />
                     <span
                        className="absolute top-9 right-2 text-gray-500 cursor-pointer"
                        onClick={handlePasswordToggle}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
                  >
                    Register
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default PatientRegistration;
