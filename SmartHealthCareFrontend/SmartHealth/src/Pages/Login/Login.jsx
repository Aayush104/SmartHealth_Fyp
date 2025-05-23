
import axios from 'axios';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Helper from '../../Components/Helper/Helper';
import Cookies from 'js-cookie';
import Otp from '../../Components/Otp/Otp';
import Footer from '../../Components/Fotter/Fotter';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
import heart from '../../Assets/Image/Heart.png';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { Spinner } from '@chakra-ui/react'; 
import ChatBot from '../../Components/Chat/ChatBot';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [failure, setFailure] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigateTo = useNavigate();

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFailure(false);

    if (!email || !password) {
      setFailure(true);
      return;
    }

    setIsSubmitting(true); // Show spinner

    try {
      const response = await axios.post("https://localhost:7070/api/User/Login", {
        email,
        password,
      });


   if (response.data.isSuccess) {
        const token = response.data.data;
        const userRole = JSON.parse(atob(token.split('.')[1])).Role;
        const userName = JSON.parse(atob(token.split('.')[1])).Name;
        const name = userName.split(' ').join('_');

        Cookies.set("Token", token, { expires: 7 });
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        
        if (userRole === "Admin") {
          navigateTo('/admin/dashboard');
        } else if(userRole === "Doctor") {
          navigateTo(`/DoctorProfile/${name}`);
        } else {
          if (redirectUrl) {
            navigateTo(redirectUrl);
            localStorage.removeItem('redirectAfterLogin');
          } else {
            navigateTo('/home');
          }
        }
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          toast.info("Check Your Email");
          setUserId(data.message);
        } else if (status === 404) {
          toast.error(data.message);
        }else if (status === 403) {
          toast.error(data.message);
         } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setIsSubmitting(false); // Hide spinner after submission is complete
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      if (response.credential) {
        setIsSubmitting(true); // Show spinner
        const decodedData = jwtDecode(response.credential);

        const data = await axios.post("https://localhost:7070/api/User/GoogleLogin", {
          Name: decodedData.name,
          Email: decodedData.email
        });

       

        if (data && data.data && data.data.isSuccess) {
          const token = data.data.data;
          const userRole = JSON.parse(atob(token.split('.')[1])).Role;
          const userName = JSON.parse(atob(token.split('.')[1])).Name;
          const name = userName.split(' ').join('_');

          Cookies.set("Token", token, { expires: 7 });
          
          const redirectUrl = localStorage.getItem('redirectAfterLogin');
          
          if (userRole === "Patient") {
            if (redirectUrl) {
              navigateTo(redirectUrl);
              localStorage.removeItem('redirectAfterLogin');
            } else {
              navigateTo('/home');
            }
          } else if(userRole === "Admin") {
            navigateTo('/admin/dashboard');
          } else if(userRole === "Doctor") {
            navigateTo(`/DoctorProfile/${name}`);
          }
        } else {
          toast.error('Login failed!');
        }
      } else {
        toast.error('No credentials received');
        console.error('No credentials found in the response.');
      }
    } catch (error) {
      toast.error('Google Login Failed!');
      console.error('Error during Google login:', error.message);
    } finally {
      setIsSubmitting(false); // Hide spinner after completion
    }
  };

  const handleGoogleLoginFailure = () => {
    toast.error("Google Login Failed!");
  };

  return (
    <div className="overflow-hidden relative"> 
      <ChatBot />
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </div>
      )}
      <Navbar />
      <motion.div 
        className="absolute lg:top-[-50px] lg:left-[-120px] md:top-[-40px] md:left-[-90px] sm:top-[-30px] sm:left-[-100px] top-[-10px] left-[-60px] 
          bg-sky-400 opacity-80 rounded-full z-[-1] 
          400px:w-48 400px:h-48 
          500px:w-54 500px:h-54 
          700px:w-60 700px:h-70 
          800px:w-72 800px:h-72
          1000px:w-72 1000px:h-72
          lg:w-72 lg:h-72 
          md:w-64 md:h-64
          sm:w-60 sm:h-60
          w-56 h-56"
        animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.05, 1] }} 
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>

      <div className="relative mt-1"> 
        {userId ? (
          <Otp userId={userId} Purpose="Registration" />
        ) : (
          <div className="relative">
            <Helper />
            <div className="flex items-center justify-center h-90 mt-8">
              <div className="lg:w-[25rem] h-full md:bg-loginbg bg-cover lg:flex justify-center items-center rounded-tl-[15px] rounded-bl-[15px] hidden md:block"></div>

              <div className="bg-white p-8 border border-gray-300 w-full h-full max-w-sm rounded-tr-[15px] rounded-br-[15px]">
                <div className="flex items-center justify-center ml-8 mt-4">
                  <h2 className="text-[1.8rem] font-bold text-center text-sky-600">Smart Health</h2>
                  <motion.img
                    src={heart}
                    className="w-8"
                    animate={{
                      rotate: [0, 12, -12, 12, -12, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    alt="Heart Icon"
                  />
                </div>
                <p className="text-lg font-medium text-center text-sky-500">Sign In</p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">
                      Email
                    </label>
                    
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${failure && !email ? 'border-red-500 shake' : 'border-gray-300'} focus:ring-blue-500 transition-all duration-200`}
                    />
                    {failure && !email && <p className="text-red-500 text-sm">This field is required.</p>}
                  </div>
                  <div className="mb-4 relative">
                    <label htmlFor="password" className="block text-gray-700">
                      Password
                    </label>
                  
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${failure && !password ? 'border-red-500 shake' : 'border-gray-300'} focus:ring-blue-500 transition-all duration-200`}
                    />
                    {failure && !password && <p className="text-red-500 text-sm">This field is required.</p>}
                    <span
                      onClick={handlePasswordToggle}
                      className="absolute right-3 top-10 transform -translate-y-1/2 cursor-pointer text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    <NavLink to="/forgetPassword">
                      <p className="text-right mt-1 text-sky-500">Forget Password?</p>
                    </NavLink>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    Sign In
                  </button>
                </form>

                <div className="flex items-center justify-center my-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <p className="mx-4 text-gray-400">OR</p>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-center border border-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-50 transition-all duration-300" onClick={() => document.querySelector('.google-login-button button')?.click()}>
                    <img
                      src="https://static.vecteezy.com/system/resources/previews/013/948/549/non_2x/google-logo-on-transparent-white-background-free-vector.jpg"
                      className="w-6 h-6 mr-2"
                      alt="Google Logo"
                    />
                    <span className="text-gray-700">Sign in with Google</span>
                  </div>
                  <div className="google-login-button absolute top-0 left-0 w-full h-full opacity-0">
                    <GoogleLogin
                      onSuccess={handleGoogleLoginSuccess}
                      onError={handleGoogleLoginFailure}
                      useOneTap
                    />
                  </div>
                </div>

<div className='flex items-center justify-center'>
                <p className="mt-4 text-sm text-center text-gray-500">
                  Don't have an account? 
                  
                </p>
                <NavLink to="/patientRegistration" >
                  <p className="text-sky-500 ml-1 items-center justify-center mt-4 cursor-pointer">Sign Up</p>
                  </NavLink>
                  </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Positioning the pink circle to partially overlap the footer */}
      <div className="relative">
  <motion.div 
    className="absolute
      bg-pink-400 opacity-90 rounded-full -z-10
      lg:w-72 lg:h-72 
      md:w-64 md:h-64
      sm:w-60 sm:h-60
      w-56 h-56
      lg:right-[-50px] lg:bottom-[285px]
      md:right-[-40px] md:bottom-[220px]
      sm:right-[-30px] sm:bottom-[180px]
      right-[-20px] bottom-[-28px]"
    animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.05, 1] }} 
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  ></motion.div>
  <Footer />
</div>
    </div>
  );
};

export default Login;
