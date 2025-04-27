import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ConfirmDoctorEmail = () => {
  const { email, otp } = useParams();
  const [visual, setVisual] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7070/api/Admin/ConfirmDoctorEmail/${email}/${otp}`);

        if (response.data.isSuccess === true) {
          setVisual(true);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error confirming doctor email:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email, otp]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <p>Loading, please wait...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {visual ? (
        <section className="flex flex-col items-center justify-center py-8 px-4">
          <p className="text-center text-lg md:text-xl font-medium mb-4">
            Thank you for registering with us! We take great pleasure in welcoming you to <span className="font-bold">SmartHealth.com</span> and are committed to providing you with excellent service.
          </p>
          <p className="text-center text-base md:text-lg">
            Click here to{' '}
            <a href="/login" className="text-blue-500 underline hover:text-blue-700">
              Login
            </a>
          </p>
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center py-8 px-4">
          <p className="text-center text-lg md:text-xl font-medium mb-4 text-red-600">
            Ooops, something went wrong!
          </p>
          <p className="text-center text-base md:text-lg">
            Uh oh, we couldn't find the link for the URL you clicked. Please check our help center for assistance, or head back to the <a href="/" className="text-blue-500 underline hover:text-blue-700">home page</a>.
          </p>
        </section>
      )}
    </div>
  );
};

export default ConfirmDoctorEmail;
