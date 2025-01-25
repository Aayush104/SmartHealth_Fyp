import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Phone, User, Edit2 } from 'lucide-react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Fotter/Fotter';
import axios from 'axios';
import Cookies from 'js-cookie';
import { CgProfile } from "react-icons/cg";
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';



  const ConfirmBooking = () => {
    const Id = Cookies.get("Token");
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [doctorDetails, setDoctorDetails] = useState(null);
    const [patientDetails, setPatientDetails] = useState(null);
    const [patientAddress, setPatientAddress] = useState(null);
    const [patientGender, setPatientGender] = useState(null);
  
    useEffect(() => {
      const details = localStorage.getItem('AppointmentDetails');
      if (details) {
        try {
          const parsedDetails = JSON.parse(details);
          if (parsedDetails.Id) {
            setAppointmentDetails(parsedDetails);
          }
        } catch (error) {
          console.error('Error parsing appointment details:', error);
        }
      }
    }, []);
  
    const MakeEsewaPayment = async () => {
      try {
        const response = await axios.post("https://localhost:7070/api/Appointment/paywithesewa", {
          PaidAmount: Number(doctorDetails.fee) 
        });

        if(response.status == 500)
        {
          toast.error ("An internal server error occured")
        }
        window.location.href = response.data.paymentUrl;
        console.log("Payment response:", response.data.paymentUrl);
      } catch (error) {
        console.error("Error making payment:", error.response ? error.response.data : error.message);
      }
    };
    

    useEffect(() => {
      const fetchData = async () => {
        if (appointmentDetails) {
          try {
            const response = await axios.get(`https://localhost:7070/api/Doctor/GetDoctorDetails/${appointmentDetails.Id}`);
            const responseforPatient = await axios.get('https://localhost:7070/api/Patient/GetPatientDetails', {
              headers: {
                Authorization: `Bearer ${Id}`,
              },
            });

            // console.log("wh", responseforPatient.data.data.gender)
            setPatientAddress(responseforPatient.data.data.address);
            setPatientGender(responseforPatient.data.data.gender)

console.log("Patient", responseforPatient);
            setPatientDetails(responseforPatient.data.data.user);

            console.log("doctor ko free", response.data.data.doctor)
            setDoctorDetails(response.data.data.doctor);
          } catch (error) {
            console.error("Error fetching details:", error);
          }
        }
      };
  
      if (appointmentDetails) {
        fetchData();
      }
    }, [appointmentDetails]);
  
    if (!appointmentDetails || !doctorDetails || !patientDetails) {
      return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-pulse text-lg text-gray-600">Loading details...</div>
        </div>
      );
    }
  
    const formatTime = (time) => {
      const hours = parseInt(time.split(":")[0], 10);
      const minutes = time.split(":")[1];
      const isAM = hours < 12;
      const formattedHours = hours % 12 || 12;
      const period = isAM ? 'AM' : 'PM';
      return `${formattedHours}:${minutes} ${period}`;
    };
  
    const placeholderImage = "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg";
  
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto mt-8 px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 max-w-[30rem]">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-b mb-2">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 text-sky-500" />
                        <span className="text-gray-600">
                          Date: <span className="font-semibold text-gray-900">{appointmentDetails.date}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 text-sky-500" />
                        <span className="text-gray-600">
                          Time: <span className="font-semibold text-gray-900">{formatTime(appointmentDetails.StartTime)}</span>
                        </span>
                      </div>
                    </div>
                    <NavLink to={`/Doctors/${appointmentDetails.Id}`} className="flex items-center text-sky-500 hover:text-sky-600 transition-colors">
                      <Edit2 className="h-4 w-4 mr-2" />
                      <span className="font-medium">Change Date & Time</span>
                    </NavLink>
                  </div>
                </div>
  
                <div className="px-5 py-4">
                  <div className="flex items-start space-x-6 p-6 bg-gray-50 rounded-lg border">
                    <img
                      src={doctorDetails?.profileget || placeholderImage}
                      alt={doctorDetails?.name || "Doctor"}
                      className="h-40 w-32 rounded-lg object-cover"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-sky-500 mb-2"> Dr. {doctorDetails?.fullName || "Dr. Name"}</h2>
                      <div className="space-y-2">
                        <p className="font-medium text-gray-600">{doctorDetails?.qualification || "MBBS"}</p>
                        <p className="font-medium text-gray-600">{doctorDetails?.specialization || "Specialization"}</p>
                        <p className=" font-medium text-gray-600">Experience: {doctorDetails?.experience || "5 years"}</p>
                        <p className="font-medium text-gray-600">Consultation Fee: Rs. {doctorDetails?.fee || "600"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="lg:col-span-1">
              <div className="bg-white max-w-[30rem] rounded-lg shadow-md overflow-hidden">
                <div className="bg-sky-500 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">Patient Details</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Patient Name</p>
                      <p className="font-medium text-gray-900">{patientDetails.fullName || "null"}</p>
                    </div>
                  </div>
  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-900">{ patientAddress|| "null"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CgProfile className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium text-gray-900">{patientGender || "null"}</p>
                    </div>
                  </div>
  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Mobile Number</p>
                      <p className="font-medium text-gray-900">{patientDetails.phoneNumber || "null"}</p>
                    </div>
                  </div>
                </div>
              </div>
  
            
              {/* <form action="https://uat.esewa.com.np/epay/main" method="POST">
  <input value={doctorDetails?.fee} name="tAmt" type="hidden" />
  <input value={doctorDetails?.fee} name="amt" type="hidden" />
  <input value="0" name="txAmt" type="hidden" />
  <input value="0" name="psc" type="hidden" />
  <input value="0" name="pdc" type="hidden" />
  <input value="EPAYTEST" name="scd" type="hidden" />
  <input value={appointmentDetails.Id} name="pid" type="hidden" />
  <input value="http://localhost:5173/success?q=su" name="su" type="hidden" />
  <input value="http://localhost:5173/failure?q=fu" name="fu" type="hidden" />
  

  <button className="w-full mt-6 bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:border-green-700 transition-colors flex items-center justify-center gap-2" type= "submit">
              Pay Via Esewa
              <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRURIPRhKOlMe7cw2N9IzXTwUICDh0EVLvcCw&s' className='h-10' alt='Esewa Logo' />
            </button>
</form> */}


<button className="w-full mt-6 bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:border-green-700 transition-colors flex items-center justify-center gap-2" onClick={MakeEsewaPayment}>
              Pay Via Esewa
              <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRURIPRhKOlMe7cw2N9IzXTwUICDh0EVLvcCw&s' className='h-10' alt='Esewa Logo' />
            </button>

            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  };
  
  export default ConfirmBooking;
  