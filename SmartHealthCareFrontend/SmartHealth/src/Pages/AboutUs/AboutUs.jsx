import React from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Fotter/Fotter';
import about1 from '../../Assets/Image/about_banner_1.jpg';
import about2 from '../../Assets/Image/about_banner_2.jpg';

import { motion } from 'framer-motion';
import DoctorTestiMonial from '../../Components/TestiMonial/DoctorTestiMonial';
import ChatBot from '../../Components/Chat/ChatBot';

const AboutUs = () => {
  return (
    <div className="bg-gray-50">
      <ChatBot />
      <Navbar />
      <div>
        <div className="h-[75vh] bg-ab_banner relative bg-cover bg-center mb-16 z-0 flex items-center justify-center ">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-800 via-blue-600 to-transparent opacity-30"></div>

          <motion.p
            className="text-slate-50 justify-between text-6xl font-semibold text-center py-32 relative z-10"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            About Us
          </motion.p>
        </div>

        <div>
          <div className="mb-10 mx-6">
            <motion.h2
              className="text-gray-600 font-bold text-2xl md:text-3xl mx-8"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              Our Mission
            </motion.h2>
            <div className="absolute left-1 flex items-center mt-0 mx-6">
              <div className="w-8 h-8 bg-sky-600 rounded-full"></div>
              <div className="h-1 w-52 bg-sky-600"></div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-around mb-24 px-4">
            <div className="relative w-[42rem] h-[60vh]  rounded-lg overflow-hidden">
              <img
                src={about2}
                alt="Healthcare Team"
                className="absolute inset-0 w-full h-full "
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-300 via-cyan-200 to-teal-200 opacity-30"></div>
            </div>

            <div className="text-gray-700 text-lg max-w-xl mt-8 space-y-6">
              <motion.h3
                className="text-3xl font-semibold mb-4"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                Making Quality Care Accessible for All
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                SmartHealthcare is on a mission to make quality healthcare affordable and accessible for over a million+ Nepalese. We believe in empowering our users with accurate, comprehensive, and curated information, enabling them to make informed healthcare decisions. Through our platform, we strive to provide a seamless healthcare experience, combining convenience with high standards of care. Our goal is to bridge the healthcare gap, bringing reliable resources, trusted health professionals, and easy access to health services directly to our users’ fingertips.
              </motion.p>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-10 mx-6">
            <motion.p
              className="text-3xl font-bold mx-10 text-gray-600"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              Who We Are
            </motion.p>
            <div className="absolute left-1 flex items-center mt-0 mx-6">
              <div className="w-8 h-8 bg-sky-600 rounded-full"></div>
              <div className="h-1 w-48 bg-sky-600"></div>
            </div>
          </div>

          <div className="flex items-center flex-col md:flex-row gap-8 justify-around mb-28 px-4">
            <img
              src={about1}
              alt="Healthcare Team"
              className="rounded-md h-[70vh] md:h-[80vh] mb-8 md:mb-0"
            />
            <div className="text-gray-700 text-lg max-w-xl mt-8 space-y-6 ">
              <motion.h3
                className="text-3xl font-semibold mb-4 "
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                Smart Healthcare for a Smarter Tomorrow
              </motion.h3>
              <motion.p
                className="text-gray-600 text-justify"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                SmartHealthcare is a comprehensive platform designed to simplify health assessments and medical appointments. Our team brings together healthcare professionals, technology experts, and community advocates, all committed to making healthcare more accessible, affordable, and efficient. With a shared belief in healthcare as a fundamental right, we’re driven to reduce barriers and connect people to the care they need. We aim to support healthier lifestyles and well-being for all by bridging the gap between medical professionals and communities across Nepal.
              </motion.p>
            </div>
          </div>
        </div>

        <div className="bg-AboutBanner py-16">
          <div className="mx-8 md:mx-28">
            <motion.h1
              className="text-3xl md:text-4xl text-sky-600 font-bold font-serif"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              Health is a Habit
            </motion.h1>
            <motion.div
              className="w-30rem text-justify mt-4 text-gray-700 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <p>
                Health is a journey that takes you to new destinations every day, filled with endless possibilities for a happier, healthier life. SmartHealthcare aims to make this journey simple and achievable for every Nepali. With our platform, you can navigate your health journey with confidence, equipped with the knowledge and resources to make informed choices for yourself and your family. Our commitment is to help you live healthier, happier, and longer lives, supporting you every step of the way.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <DoctorTestiMonial />
      <Footer />
    </div>
  );
};

export default AboutUs;
