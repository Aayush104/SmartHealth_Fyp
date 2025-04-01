import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; 
import { RxCross2 } from "react-icons/rx"; 
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiOutlineMinusCircle } from "react-icons/ai"; 
import Cookies from 'js-cookie';
import axios from "axios";
import { toast } from "react-toastify";

const AdditionalProfile = ({ onAdditionalOff }) => {
  const [experiences, setExperiences] = useState([""]);
  const [trainings, setTrainings] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [doctorData, setDoctorData] = useState(null);
  
  const token = Cookies.get("Token");
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const userId = decodedToken.userId;

  const handleAddExperience = () => {
    setExperiences([...experiences, ""]);
  };

  const handleAddTraining = () => {
    setTrainings([...trainings, ""]);
  };

  const handleRemoveExperience = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
  };

  const handleRemoveTraining = (index) => {
    const updatedTrainings = trainings.filter((_, i) => i !== index);
    setTrainings(updatedTrainings);
  };

  const handleExperienceChange = (index, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = value;
    setExperiences(updatedExperiences);
  };

  const handleTrainingChange = (index, value) => {
    const updatedTrainings = [...trainings];
    updatedTrainings[index] = value;
    setTrainings(updatedTrainings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = {
        userId: userId,
        experiences: experiences.filter(exp => exp.trim() !== ""),
        trainings: trainings.filter(train => train.trim() !== "")
      };
      
      const response = await axios.post("https://localhost:7070/api/Doctor/AddDoctorAdditionalInfo", data);
      
      
      console.log("Submitted Data:", response);

      if(response.status == 200 && !isUpdating)
      {
        toast.success("Info Added Succesfully")
      }

      if(response.status == 200 && isUpdating)
      {
        toast.success("Info Updated Succesfully")
      }

      onAdditionalOff();
    } catch (err) {
      console.error("Error submitting data:", err);
      setError("Failed to submit data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://localhost:7070/api/Doctor/GetDoctorDetails/${userId}`);
        setDoctorData(response.data);
        
        // Check if additional info exists and prefill the form
        if (response.data && 
            response.data.data && 
            response.data.data.additionalInfo) {
          
          const additionalInfo = response.data.data.additionalInfo;
          
          // Prefill experiences if they exist
          if (additionalInfo.experiences && 
              additionalInfo.experiences.$values && 
              additionalInfo.experiences.$values.length > 0) {
            setExperiences(additionalInfo.experiences.$values);
            setIsUpdating(true);
          }
          
          // Prefill trainings if they exist
          if (additionalInfo.trainings && 
              additionalInfo.trainings.$values && 
              additionalInfo.trainings.$values.length > 0) {
            setTrainings(additionalInfo.trainings.$values);
            setIsUpdating(true);
          }
        }
      } catch (err) {
        console.error("Error fetching doctor details:", err);
        setError("Failed to load doctor information.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);

  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-[55rem] bg-gray-900 bg-opacity-50 z-40 flex justify-center items-center">
        <motion.div
          className="bg-white shadow-md rounded max-w-xl p-6 relative min-w-[82rem]"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute top-2 right-2 cursor-pointer" onClick={onAdditionalOff}>
            <RxCross2 className="text-gray-500 text-2xl" />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-lg font-semibold text-gray-500">Smart Health</p>
            <p className="text-[15px] text-blue-400">{isUpdating ? "Update Additional Details" : "Add Additional Details"}</p>
          </div>
          <div className="border"></div>

          {loading && <div className="text-center py-4">Loading...</div>}

          {!loading && (
            <form className="flex flex-wrap mt-2" onSubmit={handleSubmit}>
              <div className="w-full flex gap-4">
                {/* Experiences Section */}
                <div className="mb-6">
                  <label className="text-gray-700 mb-2 text-md" htmlFor="experience">
                    Experiences
                  </label>
                  {experiences.map((exp, index) => (
                    <div className="flex items-center gap-2 mb-2" key={index}>
                      <input
                        type="text"
                        placeholder="Enter your experience"
                        value={exp}
                        onChange={(e) => handleExperienceChange(index, e.target.value)}
                        className="shadow border rounded w-[35rem] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {index === experiences.length - 1 && (
                        <IoIosAddCircleOutline
                          className="text-2xl cursor-pointer hover:text-sky-600"
                          onClick={handleAddExperience}
                        />
                      )}
                      {experiences.length > 1 && (
                        <AiOutlineMinusCircle
                          className="text-2xl cursor-pointer hover:text-red-600"
                          onClick={() => handleRemoveExperience(index)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Trainings Section */}
                <div className="mb-6">
                  <label className="text-gray-700 text-md mb-2" htmlFor="training">
                    Training and Education
                  </label>
                  {trainings.map((training, index) => (
                    <div className="flex items-center gap-2 mb-2" key={index}>
                      <input
                        type="text"
                        placeholder="Enter your training and education"
                        value={training}
                        onChange={(e) => handleTrainingChange(index, e.target.value)}
                        className="shadow border rounded w-[35rem] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {index === trainings.length - 1 && (
                        <IoIosAddCircleOutline
                          className="text-2xl cursor-pointer hover:text-sky-600"
                          onClick={handleAddTraining}
                        />
                      )}
                      {trainings.length > 1 && (
                        <AiOutlineMinusCircle
                          className="text-2xl cursor-pointer hover:text-red-600"
                          onClick={() => handleRemoveTraining(index)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Error message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-2 bg-blue-500 text-white rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? "Submitting..." : isUpdating ? "Update Info" : "Submit Info"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdditionalProfile;