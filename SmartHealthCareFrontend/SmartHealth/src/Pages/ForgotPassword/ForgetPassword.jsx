import axios from 'axios';
import { useState } from 'react';
import Otp from '../../Components/Otp/Otp';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Fotter/Fotter';
import { toast } from 'react-toastify';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("https://localhost:7070/api/User/ForgotPassword", {
        email,
      });

      if (response.data.isSuccess) {
        setUserId(response.data.data);
        setTimeout(() => {
          setLoading(false);
          setSuccess(true);
        }, 3000); // Show loading for 3 seconds
      } else {
        setLoading(false);
        toast.error("Failed to send OTP. Please try again.");
      }

      console.log('Password reset link sent to:', response);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Error sending password reset link.");
      console.error('Error sending password reset link:', error);
    }
  };

  return (
    <div className="bg-neutral-50">
      <Navbar />
      {loading ? (
        <div className="absolute top-0 left-0 w-full h-screen flex justify-center items-center bg-white z-10">
          <div>
            <iframe 
              src="https://lottie.host/embed/f0c76f96-a6b9-4b55-ad52-a3dc62715955/2imxSkN9Vh.json"
              width="250"  
              height="250" 
              title="Loading animation"
            />
            <p className="text-center text-sky-500 text-2xl">Please Wait....</p>
          </div>
        </div>
      ) : (
        success ? (
          <Otp userId={userId} Purpose="ForgetPassword" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border-2 border-gray-100">
              <h2 className="text-2xl font-semibold mb-6 mt-2 text-center">Forget Password</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sky-700 text-sm mb-2">Enter Your Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Send OTP
                </button>
              </form>
            </div>
          </div>
          
        )
      )}
      <Footer />
    </div>
  );
};

export default ForgetPassword;
