import React, { useEffect, useState } from "react";
import DoctorNav from "../../Components/Navbar/DoctorNav";
import Footer from "../../Components/Fotter/Fotter";
import axios from "axios";
import Cookies from "js-cookie";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]); // State to hold selected appointments
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

        setAppointments(response.data.data); // Set fetched data in state
      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };

    fetchData();
  }, [token]);

  // Function to select/deselect an appointment
  const toggleSelectAppointment = (appointment) => {
    setSelectedAppointments((prevSelected) => {
      const exists = prevSelected.find(
        (item) => item.appointmentId === appointment.id
      );

      if (exists) {
        // Remove from selected if already exists
        return prevSelected.filter(
          (item) => item.appointmentId !== appointment.id
        );
      } else {
        // Add to selected
        return [
          ...prevSelected,
          { patientId: appointment.patientId, appointmentId: appointment.id },
        ];
      }
    });
  };

  // Function to send selected appointments to the backend
  const sendSelectedAppointments = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7070/api/Appointment/SendSelectedAppointments", // Replace with your API endpoint
        { selectedAppointments },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response from backend:", response.data);
      alert("Selected appointments sent successfully!");
    } catch (error) {
      console.error("Error sending selected appointments", error);
      alert("Failed to send selected appointments");
    }
  };

  return (
    <div>
      <DoctorNav />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Doctor Appointments</h1>

        <table className="table-auto w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Appointment ID</th>
              <th className="px-4 py-2 border">Patient ID</th>
              <th className="px-4 py-2 border">Doctor ID</th>
              <th className="px-4 py-2 border">Appointment Date</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <tr key={appointment.id} className="text-center">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{appointment.id}</td>
                  <td className="px-4 py-2 border">{appointment.patientId}</td>
                  <td className="px-4 py-2 border">{appointment.doctorId}</td>
                  <td className="px-4 py-2 border">
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => toggleSelectAppointment(appointment)}
                      className={`${
                        selectedAppointments.some(
                          (item) => item.appointmentId === appointment.id
                        )
                          ? "bg-red-500"
                          : "bg-blue-500"
                      } text-white px-4 py-2 rounded`}
                    >
                      {selectedAppointments.some(
                        (item) => item.appointmentId === appointment.id
                      )
                        ? "Deselect"
                        : "Select"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No Appointments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Display selected appointments */}
        {selectedAppointments.length > 0 && (
          <div className="mt-4 p-4 bg-gray-100 border rounded">
            <h2 className="text-lg font-bold mb-2">Selected Appointments</h2>
            {selectedAppointments.map((item, index) => (
              <p key={index}>
                <strong>Patient ID:</strong> {item.patientId} |{" "}
                <strong>Appointment ID:</strong> {item.appointmentId}
              </p>
            ))}
          </div>
        )}

        {/* Button to send selected appointments */}
        {selectedAppointments.length > 0 && (
          <button
            onClick={sendSelectedAppointments}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Send Selected Appointments
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DoctorAppointments;
