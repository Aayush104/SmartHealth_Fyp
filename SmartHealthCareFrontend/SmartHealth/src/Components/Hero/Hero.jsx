import React, { useRef } from 'react';
import SearchDoctor from '../SearchComponent/SearchDoctor';
import { motion, useInView } from 'framer-motion';

const Hero = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { triggerOnce: false }); // Re-triggers on each view

  return (
    <div className="relative w-full h-[85vh] overflow-hidden" ref={ref}>
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="../src/Assets/Image/1st video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex flex-col gap-2.5 justify-center items-center h-full bg-black bg-opacity-50">
        {isInView && (
          <>
            <motion.h1
              className="text-white text-6xl font-bold text-center uppercase"
              initial={{ x: '-100vw' }}
              animate={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 70, damping: 20 }}
            >
              Find A Doctor
            </motion.h1>
            <motion.h3
              className="text-white text-2xl font-semibold text-center capitalize"
              initial={{ x: '-100vw' }}
              animate={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 70, damping: 20, delay: 0.2 }}
            >
              Get Personalized Care from Leading Medical Experts
            </motion.h3>
          </>
        )}
        <SearchDoctor />
      </div>
    </div>
  );
};

export default Hero;
