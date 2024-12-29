import React, { useState } from "react";
import { motion } from "framer-motion"; 
import { RxCross2 } from "react-icons/rx"; 
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiOutlineMinusCircle } from "react-icons/ai"; 
import Cookies from 'js-cookie';
import axios from "axios";

const AdditionalProfile = ({ onAdditionalOff }) => {
  const [experiences, setExperiences] = useState([""]);
  const [trainings, setTrainings] = useState([""]);
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error handling
  const token = Cookies.get("Token");
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const userId = decodedToken.userId;

  const handleAddExperience = () => {
    setExperiences([...experiences, ""]); // Add an empty string for a new experience input
  };

  const handleAddTraining = () => {
    setTrainings([...trainings, ""]); // Add an empty string for a new training input
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
    
    const data = {
      userId: userId,
      experiences,
      trainings
    };

    const response = await axios.post("https://localhost:7070/api/Doctor/AddDoctorAdditionalInfo", data)

    
    console.log("Submitted Data:", response);

    onAdditionalOff();
  };

  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-[45rem] bg-gray-900 bg-opacity-50 z-40 flex justify-center items-center">
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
            <p className="text-[15px] text-blue-400">Add Additional Details</p>
          </div>
          <div className="border"></div>

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
              {loading ? "Submitting..." : "Submit Info"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdditionalProfile;
