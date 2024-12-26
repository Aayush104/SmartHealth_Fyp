import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Fotter/Fotter';
import SearchDoctor from '../../Components/SearchComponent/SearchDoctor';
import { PiStethoscopeBold } from "react-icons/pi";
import { FaUserDoctor } from "react-icons/fa6";
import { GiGraduateCap } from "react-icons/gi";
import { MdPayment } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);  // State for controlling the visibility of additional sections

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7070/api/Doctor/GetDoctorDetails/${id}`);
        setDoctorDetails(response.data);
        console.log(response);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
        setError('Failed to fetch doctor details.');
      }
    };

    fetchDoctorDetails();
  }, [id]);

  const handleReadMoreClick = () => {
    setShowMore(true);  // Show the additional sections
  };

  const handleShowLessClick = () => {
    setShowMore(false);  // Hide the additional sections
  };

  return (
    <div className='bg-neutral-100'>
      <Navbar />
      <div className='px-28 mt-2'>
        <SearchDoctor />
      </div>
      <div>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : doctorDetails ? (
          <div>
            <div className='mx-8 mb-8 px-20 '>
              <div className='border w-[45rem] bg-white p-2 flex items-center shadow justify-between'>
                <div className='flex gap-8'>
                  <img
                    src={doctorDetails.profileget}
                    // src="https://png.pngtree.com/png-vector/20230928/ourmid/pngtree-young-afro-professional-doctor-png-image_10148632.png"
                    className="h-30 w-40  text-white border rounded"
                    alt={`Dr. ${doctorDetails.fullName}`}
                  />
                  <div>
                    <div className='mt-2 text-gray-500 leading-7'>
                      <div className='flex gap-2 font-semibold'>
                        {
                          doctorDetails.fee == null ? (
                            <div>
                              <h2 className="text-3xl font-bold capitalize text-sky-500 mt-2">Dr. {doctorDetails.fullName}</h2>
                              <span className="mt-3 text-sm">Profile is Claimed</span>
                            </div>
                          ) : (
                            <div>
                              <h2 className="text-3xl font-bold capitalize text-sky-500">Dr. {doctorDetails.fullName}</h2>
                              <span className="mt-3 text-sm">Profile is Claimed</span>
                            </div>
                          )
                        }
                      </div>
                      <p className='flex gap-2'>  <PiStethoscopeBold className='mt-2'/> {doctorDetails.experience} experience overall</p>
                      <p className='flex gap-2'> <FaUserDoctor className='mt-1.5' />{doctorDetails.specialization}</p>
                      <p className='uppercase flex gap-2'> <GiGraduateCap className='mt-1.5 text-lg' />{doctorDetails.qualifications}</p>
                      {
                        doctorDetails.fee == null ? "" : <p className='flex gap-2'> <MdPayment className='mt-2' />Fee: Rs.{doctorDetails.fee}</p>
                      }
                    </div>
                  </div>
                </div>
                <div className="mr-4 flex gap-8 flex-col">
                <div className='border p-2 rounded-full bg-neutral-200 cursor-pointer'>
                  <FaRegHeart className='text-xl text-gray-700 hover:text-red-500 transition ease-out '/>
                </div>
                <div className='border p-2 rounded-full bg-neutral-200 cursor-pointer '>
                  <FaRegComment className='text-gray-700 text-xl transition ease-out hover:text-sky-600 ' />
                </div>
              </div>
              </div>
              <div className='bg-white border w-[45rem] mt-8 p-4 rounded-sm shadow-md'>
              <div className='mb-5'>
                <div className='relative'>
                  <h2 className='font-bold text-1.8rem'>Overview</h2>
                  <div className='h-1 w-20 bg-sky-500 absolute left-11'></div>
                </div>
                <p className='text-md text-gray-500 mt-4 text-justify'>{doctorDetails.description}</p> {/* Show only a snippet of the overview */}
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
                  <div className='mb-5'>
                    <div className='relative'>
                      <h2 className='font-bold text-1.8rem'>Experience</h2>
                      <div className='h-1 w-20 bg-sky-500 absolute left-16'></div>
                    </div>
                    <p className='text-md text-gray-500 mt-4 text-justify'>{doctorDetails.description}</p>
                  </div>

                  <div className='mb-5'>
                    <div className='relative'>
                      <h2 className='font-bold text-1.8rem'>Education And Training</h2>
                      <div className='h-1 w-[10.5rem] bg-sky-500 absolute left-36'></div>
                    </div>
                    <p className='text-md text-gray-500 mt-4 text-justify'>{doctorDetails.description}</p>
                  </div>

                 
                  <button
                    onClick={handleShowLessClick}
                    className="text-sky-500 mt-2 text-center cursor-pointer"
                  >
                    Show Less
                  </button>
                </div>
              )}
            </div>
              
            </div>

           
           
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDetails;
