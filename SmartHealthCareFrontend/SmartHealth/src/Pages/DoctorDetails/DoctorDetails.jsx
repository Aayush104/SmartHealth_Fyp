import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Fotter/Fotter';
import SearchDoctor from '../../Components/SearchComponent/SearchDoctor';
import { PiStethoscopeBold } from "react-icons/pi";
import { FaUserDoctor, FaRegComment, FaRegHeart } from "react-icons/fa6";
import { GiGraduateCap } from "react-icons/gi";
import { MdPayment } from "react-icons/md";
import TimeSlot from '../../Components/TimeSlot/TimeSlot';

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {

    const details = localStorage.getItem('AppointmentDetails');

    if(details)
    {
      localStorage.removeItem("AppointmentDetails");

    }
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7070/api/Doctor/GetDoctorDetails/${id}`);
        setDoctorDetails(response.data?.data || {});
        console.log(response.data?.data);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
        setError('Failed to fetch doctor details.');
      }
    };

    fetchDoctorDetails();
  }, [id]);

  const handleReadMoreClick = () => setShowMore(true);
  const handleShowLessClick = () => setShowMore(false);

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!doctorDetails) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  const { doctor, additionalInfo } = doctorDetails;
  const placeholderImage = "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg";

  return (
    <div className="bg-neutral-100">
      <Navbar />
      <div className="px-28 mt-2">
        <SearchDoctor />
      </div>
      <div className='flex gap-2'>
      <div className="mx-8 mb-8 px-20 ">
        <div className="border w-[45rem] bg-white p-2 flex items-center shadow justify-between">
          <div className="flex gap-8">
            <img
              src={doctorDetails.doctor?.profileget || placeholderImage}
              className="h-30 w-40 text-white border rounded"
              alt={`Dr. ${doctor?.fullName || "Doctor"}`}
            />
            <div>
              <div className="mt-2 text-gray-500 leading-7">
                <h2 className="text-3xl font-bold capitalize text-sky-500">
                  Dr. {doctor?.fullName || "Unknown"}
                </h2>
                <span className="mt-3 text-sm">Profile is Claimed</span>
                <p className="flex gap-2">
                  <PiStethoscopeBold className="mt-2" />
                  {doctor?.experience || "N/A"} experience overall
                </p>
                <p className="flex gap-2">
                  <FaUserDoctor className="mt-1.5" />
                  {doctor?.specialization || "Specialization not available"}
                </p>
                <p className="uppercase flex gap-2">
                  <GiGraduateCap className="mt-1.5 text-lg" />
                  {doctor?.qualifications || "Qualifications not available"}
                </p>
                {doctor?.fee && (
                  <p className="flex gap-2">
                    <MdPayment className="mt-2" />
                    Fee: Rs.{doctor?.fee}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mr-4 flex gap-8 flex-col">
            <div className="border p-2 rounded-full bg-neutral-200 cursor-pointer">
              <FaRegHeart className="text-xl text-gray-700 hover:text-red-500 transition ease-out" />
            </div>
            <div className="border p-2 rounded-full bg-neutral-200 cursor-pointer">
              <FaRegComment className="text-gray-700 text-xl transition ease-out hover:text-sky-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border w-[45rem] mt-8 p-4 rounded-sm shadow-md">
          <div className="mb-5">
            <h2 className="font-bold text-1.8rem">Overview</h2>
            <p className="text-md text-gray-500 mt-4 text-justify">{doctor?.description || "No description available."}</p>
            {!showMore && (
              <button
                onClick={handleReadMoreClick}
                className="text-sky-500 mt-2 cursor-pointer"
              >
                Read More
              </button>
            )}
          </div>

          {showMore && (
            <div>
              {/* Experiences Section */}
              <div className="mb-5">
                <h2 className="font-bold text-1.8rem">Experience</h2>
                <ul className="text-md text-gray-500 mt-4 list-decimal pl-5">
                  {additionalInfo?.experiences?.$values?.length > 0 ? (
                    additionalInfo.experiences.$values.map((exp, idx) => (
                      <li key={idx} className='font-semibold leading-loose'>{exp}</li>
                    ))
                  ) : (
                    <li>No experience data available.</li>
                  )}
                </ul>
              </div>

              {/* Trainings Section */}
              <div className="mb-5">
                <h2 className="font-bold text-1.8rem">Education and Training</h2>
                <ul className="text-md text-gray-500 mt-4 list-decimal pl-5">
                  {additionalInfo?.trainings?.$values?.length > 0 ? (
                    additionalInfo.trainings.$values.map((training, idx) => (
                      <li key={idx} className='font-semibold leading-loose'>{training}</li>
                    ))
                  ) : (
                    <li>No training data available.</li>
                  )}
                </ul>
              </div>

              <button
                onClick={handleShowLessClick}
                className="text-sky-500 mt-2 cursor-pointer"
              >
                Show Less
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
  <TimeSlot fee={doctor?.fee} Id={id} />
</div>

      </div>
      <Footer />
    </div>
  );
};

export default DoctorDetails;
