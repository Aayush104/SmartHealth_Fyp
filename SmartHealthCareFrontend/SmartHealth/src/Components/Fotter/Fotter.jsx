import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { IoLocation, IoMail } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import logo from '../../Assets/Image/Logo.png';

const Footer = () => {
  return (
    <footer className='py-8 px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 bg-primary text-white mt-20 overflow-hidden'>
    
      <div>
        <img src={logo} className='w-60 h-25' alt="Smart Health logo" />
        <p className='text-justify text-lg mt-4'>
        At Smart Health, we connect patients with doctors and make booking appointments quick and easy. We simplify healthcare access, ensuring you get the care you need without the hassle.
        </p>
      </div>

    
      <div className='mt-8 md:mt-0 md:mx-auto'>
        <h2 className='text-3xl font-medium mb-6'>Quick Links</h2>
        <ul>
          <NavLink to="/" className="mb-4 flex items-center hover:text-cyan-300">
            <IoIosArrowForward /> Home
          </NavLink>
          <NavLink to='/FindDoctor' className="mb-4 flex items-center hover:text-cyan-300">
            <IoIosArrowForward /> Find Doctor
          </NavLink>
          <NavLink to="/Contact" className="mb-4 flex items-center hover:text-cyan-300">
            <IoIosArrowForward /> Send Us Message
          </NavLink>
          <NavLink to="/About" className="mb-4 flex items-center hover:text-cyan-300">
            <IoIosArrowForward /> About Us
          </NavLink>
          <NavLink to='/Privacy' className="mb-4 flex items-center hover:text-cyan-300">
            <IoIosArrowForward /> Q&A
          </NavLink>
          <NavLink to='/Terms' className="mb-4 flex items-center hover:text-cyan-300">
            <IoIosArrowForward /> Terms Of Services
          </NavLink>
        </ul>
      </div>

      {/* Contact Information */}
      <div className='mt-8 md:mt-0'>
        <h2 className='text-3xl font-medium mb-6'>Have a Question?</h2>
        <div className='flex flex-col'>
          <div className='mb-6 flex gap-4'>
            <IoLocation className='text-4xl' aria-label="Location Icon" />
            <span>Duhabi-05, Sunsari, Nepal</span>
          </div>
          <div className='mb-6 flex gap-4 items-center'>
            <FaPhoneAlt className='text-xl' aria-label="Phone Icon" />
            <span>+977 982-7102964</span>
          </div>
          <div className='mb-6 flex gap-4 items-center'>
            <IoMail className='text-2xl' aria-label="Mail Icon" />
            <span>aayushadhikari601@gmail.com</span>
          </div>
        </div>
      </div>

    
      <div className='mt-8 md:mt-0'>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m20!1m8!1m3!1d1614.6394768207488!2d87.2777715!3d26.5693084!3m2!1i1024!2i768!4f13.1!4m9!3e6!4m3!3m2!1d26.568389!2d87.278059!4m3!3m2!1d26.5683947!2d87.27806629999999!5e1!3m2!1sen!2snp!4v1730034763113!5m2!1sen!2snp"
          width="100%"
          height="250"
          allowFullScreen=""
          loading="lazy"
          title="Smart Health Location"
        ></iframe>
      </div>

      {/* Footer Text */}
      <div className='text-center pb-8 md:col-span-4'>
        <p>© 2024 All rights reserved || Smart Health</p>
      </div>
    </footer>
  );
}

export default Footer;
