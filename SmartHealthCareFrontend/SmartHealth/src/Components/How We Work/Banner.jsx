import React from 'react';
import { motion } from 'framer-motion';

const Banner = () => {
  return (
    <div className="bg-banner h-full mt-28 mb-8 w-full bg-cover bg-center flex items-center justify-center">
      <div className="text-center">
        <span className="text-gray-400 font-semibold">We Are Here to Serve</span>

        {/* Motion spans for the pop-up effect */}
        <div className="flex flex-col text-white font-bold text-Subheading">
          <motion.span
            className="mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }} // Trigger each time it comes into view
            transition={{ type: 'spring', stiffness: 100, damping: 25 }}
          >
            Consult Top Doctor Online
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ type: 'spring', stiffness: 100, damping: 25, delay: 0.2 }}
          >
            For Any Health Concern
          </motion.span>
        </div>

     
        <motion.button
          className="bg-pink-700 p-3 text-white rounded-md mt-4 hover:bg-pink-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ type: 'spring', stiffness: 100, damping: 25, delay: 0.4 }}
        >
          Make Appointment
        </motion.button>
      </div>
    </div>
  );
};

export default Banner;
