import React, { useEffect, useState } from "react";
import DoctorNav from "../../Components/Navbar/DoctorNav";
import Footer from "../../Components/Fotter/Fotter";
import axios from "axios";
import Cookies from "js-cookie";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const token = Cookies.get("Token");

  // Fetch appointments from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7070/api/Appointment/GetAppointmentList",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Appointments Data", response.data.data);

        setAppointments(response.data.data.$values || []); // Handle nested $values array
      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <DoctorNav />

      <div className="container mx-auto my-8">
        <h1 className="text-2xl font-bold text-center mb-4">Appointments</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">Patient Name</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Slot</th>
                <th className="border border-gray-300 px-4 py-2">Payment Status</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <tr key={appointment.appointmentId} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {appointment.patientFullName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{appointment.slot}</td>
                    <td className="border border-gray-300 px-4 py-2">{appointment.paymentStatus}</td>
                    <td className="border border-gray-300 px-4 py-2">{appointment.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center border border-gray-300 px-4 py-2"
                  >
                    No Appointments Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorAppointments;
