import { Navigate } from 'react-router-dom';


const PrivateRoute = ({ element: Element, ...rest }) => {

 
  const appointmentDetails = localStorage.getItem('AppointmentDetails');

  // If appointment details are missing, redirect to the Home page
  if (!appointmentDetails) {
    return <Navigate to="/Home" />;
  }

  // Otherwise, render the requested element
  return <Element {...rest} />;
};
 
export default PrivateRoute;