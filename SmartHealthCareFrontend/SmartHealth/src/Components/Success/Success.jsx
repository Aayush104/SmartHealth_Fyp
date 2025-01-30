// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation, NavLink } from "react-router-dom";
// import axios from "axios";
// import Cookies from "js-cookie";
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Fotter/Fotter";
// import { Spinner } from "@chakra-ui/react";

// const Success = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const data = queryParams.get("data") || "";


// const paymentGateway = localStorage.getItem("PaymentGateway");

//   const details = JSON.parse(localStorage.getItem("AppointmentDetails")) || {};
//   const startTime = details.StartTime || "Not provided";
//   const appointmentDate = details.date || "Not provided";
//   const doctorId = details.Id || "Not provided";
//   const fee = details.Fee;

//   const token = Cookies.get("Token");
//   const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : {};
//   const userName = decodedToken.Name || "Patient";

//   const navigate = useNavigate();
//   const [success, setSuccess] = useState(null);
//   const [doctorName, setDoctorName] = useState("");
//   const actionCalled = useRef(false);


//   //for esewa
//   const Esewaactions = async () => {
//     if (!data || !token) {
//       console.error("Missing required parameters or token.");
//       setSuccess(false);
//       return;
//     }

//     try {
//       const requestBody = {
//         queryType: data,
//         doctorId: doctorId,
//         StartTime: startTime,
//         AppointmentDate: appointmentDate,
//       };

//       const response = await axios.post(
//         `https://localhost:7070/api/Appointment/Success`,
//         requestBody,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log(response)
//       if (response.status === 200) {
       
//         setDoctorName(response.data.data.data || "Unknown Doctor");
//         setSuccess(true);
      
       
//       } else {
//         setSuccess(false);
//       }
//     } catch (error) {
//       console.error("Error during API request:", error);
//       setSuccess(false);
//     }
//   };

//   useEffect(() => {

//     console.log(paymentGateway)
 
//     if (!actionCalled.current) {

//       if(paymentGateway && paymentGateway == "Esewa")
//       {
//         Esewaactions();
//       }

//       if(paymentGateway && paymentGateway == "Khalti")
//         {
//           console.log("This is khalti")
//         }

     
    
      
//       actionCalled.current = true;
    
//     }
//   }, []);



  
//   useEffect(() => {
//     if (success) {
//       setTimeout(() => {
//         navigate("/payment-success", {
//           state: {
//             appointmentDetails: {
//               patientName: userName,
//               doctorName: doctorName,
//               dateTime: `${appointmentDate} | ${startTime}`,
              
//             },
//             fee: fee,
//           },
//         });
//       }, 2000);
//     }
//   }, [success, navigate, doctorName, userName, appointmentDate, startTime, fee]);
  

//   if (success === null) {
//     return  <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
//     <Spinner
//       thickness="4px"
//       speed="0.65s"
//       emptyColor="gray.200"
//       color="blue.500"
//       size="xl"
//     />
//   </div>;
//   }

//   if (success === false) {
//     return (
//       <div className="text-center mt-20 text-red-500">
//         Something went wrong. Please try again later.
//       </div>
//     );
//   }

//   return (

//     <>
//   <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
//                 <Spinner
//                   thickness="4px"
//                   speed="0.65s"
//                   emptyColor="gray.200"
//                   color="blue.500"
//                   size="xl"
//                 />
//               </div>
//     </>

//   );
// };

// export default Success;



import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import { Spinner } from "@chakra-ui/react";

const Success = () => {
  const location = useLocation();
  
const paymentGateway = localStorage.getItem("PaymentGateway");
  const queryParams = new URLSearchParams(location.search);


  //if esewa ho vaney params bata data vaney tanxa if khalti ho vaney pidx vaney tanxa
  const data = paymentGateway && paymentGateway == "Esewa" ?
  queryParams.get("data") : queryParams.get("pidx");



  const details = JSON.parse(localStorage.getItem("AppointmentDetails")) || {};
  const startTime = details.StartTime || "Not provided";
  const appointmentDate = details.date || "Not provided";
  const doctorId = details.Id || "Not provided";
  const fee = details.Fee;
  const endTime = details.EndTime

  const token = Cookies.get("Token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const userName = decodedToken.Name || "Patient";

  const navigate = useNavigate();
  const [success, setSuccess] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const actionCalled = useRef(false);



  const actions = async () => {
    if (!data || !token) {
      console.error("Missing required parameters or token.");
      setSuccess(false);
      return;
    }
  
    try {
      const requestBody = {
        queryType: data,
        doctorId: doctorId,
        StartTime: startTime,
        AppointmentDate: appointmentDate,
        EndTime : endTime,
      };
  
      let response;
  
      if (paymentGateway && paymentGateway === "Esewa") {
        response = await axios.post(
          `https://localhost:7070/api/Appointment/Success`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          `https://localhost:7070/api/Appointment/KhaltiSuccess`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
  
      console.log(response);
      if (response.status === 200) {
        setDoctorName(response.data.data.data || "Unknown Doctor");
        setSuccess(true);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error during API request:", error);
      setSuccess(false);
    }
  };
  

  useEffect(() => {

    console.log(paymentGateway)
 
    if (!actionCalled.current) {

      actions();
      actionCalled.current = true;
    
    }
  }, []);



  
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate("/payment-success", {
          state: {
            appointmentDetails: {
              patientName: userName,
              doctorName: doctorName,
              dateTime: `${appointmentDate} | ${startTime}`,
              
            },
            fee: fee,
          },
        });
      }, 2000);
    }
  }, [success, navigate, doctorName, userName, appointmentDate, startTime, fee]);
  

  if (success === null) {
    return  <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  </div>;
  }

  if (success === false) {
    return (
      <div className="text-center mt-20 text-red-500">
        Something went wrong. Please try again later.
      </div>
    );
  }

  return (

    <>
  <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </div>
    </>

  );
};

export default Success;
