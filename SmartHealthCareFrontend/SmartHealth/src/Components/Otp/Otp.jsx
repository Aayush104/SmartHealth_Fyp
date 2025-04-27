import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ResetPassword from '../../Pages/ChangePassword/ResetPassword';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Otp = ({ userId: initialUserId, Purpose: initialPurpose }) => {
  const [userId, setUserId] = useState(initialUserId);
  const [Purpose, setPurpose] = useState(initialPurpose);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [changePassword, setChangePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);
  const navigateTo = useNavigate();

  useEffect(() => {
    setUserId(initialUserId);
    setPurpose(initialPurpose);


    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    
    return () => clearInterval(countdown);
  }, [initialUserId, initialPurpose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post("https://localhost:7070/api/User/VerifyOtp", {
        userId,
        otp: enteredOtp,
        Purpose,
      });



      if (response.data.isSuccess) {
        if (Purpose === "ForgetPassword") {
          setChangePassword(true);
        } else {
        
       
          navigateTo('/login');
          toast.success("Otp Verified Please login")
        
          window.location.reload();
        }
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("There was an error verifying the OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setMessage(''); 
    setError('');
    setIsLoading(true);
    setResendDisabled(true);
    setTimer(60); // Reset timer to 60 seconds

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      const response = await axios.get(`https://localhost:7070/api/User/ResendOtp/${userId}/${Purpose}`);
      console.log(response);
      setMessage("An OTP has been sent to your email.");
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("There was an issue resending the OTP. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4 h-full ">
      {changePassword ? (
        <ResetPassword userId={userId} />
      ) : (
        <div className=" p-8 shadow-md rounded-md max-w-sm w-full bg-gray-50 border-2 border-gray-100">
          <h2 className="text-3xl font-semibold mb-6 text-center">Verify OTP</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {message && <p className="text-green-500 text-center mb-4">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sky-700 text-sm mb-2">
                Enter the OTP sent to your email
              </label>
              <input
                id="otp"
                type="text"
                name="otp"
                required
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="OTP input"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              {isLoading ? 'Verifying...' : 'Submit OTP'}
            </button>

            <p className="text-gray-500 text-center mt-2 text-sm">
              Didn't receive the OTP?{' '}
              <span
                className={`font-semibold ${resendDisabled ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer underline text-sky-500 hover:text-sky-600'}`}
                onClick={!resendDisabled ? handleResendOtp : null}
              >
                Resend {resendDisabled && `(${timer}s)`}
              </span>
            </p>

            <p className="text-gray-500 text-center mt-2 text-sm">Your OTP should arrive shortly.</p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Otp;
