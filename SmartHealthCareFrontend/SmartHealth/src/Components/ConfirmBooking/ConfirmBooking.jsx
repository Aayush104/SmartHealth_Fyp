import { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';

const ConfirmBooking = () => {
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  useEffect(() => {
    const details = localStorage.getItem('AppointmentDetails');
    if (details) {
      setAppointmentDetails(JSON.parse(details));
    }
  }, []);

  if (!appointmentDetails) {
    return <div>Loading...</div>;
  }



  return (
    <div>
    <Navbar />
      <h1>Confirm Your Booking</h1>
      <p>DoctorId: {appointmentDetails.Id}</p>
      <p>Date: {appointmentDetails.date}</p>
      <p>Start Time: {appointmentDetails.StartTime}</p>
      <p>End Time: {appointmentDetails.EndTime}</p>
      {/* Add further appointment details */}
    </div>
  );
};

export default ConfirmBooking;