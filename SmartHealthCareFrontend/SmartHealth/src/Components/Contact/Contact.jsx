import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import Footer from '../Fotter/Fotter'; // Import Footer
import { useLocation } from 'react-router-dom';

const Contact = () => {
  const location = useLocation();
  const [isContactPage, setIsContactPage] = useState(false);

  useEffect(() => {
    setIsContactPage(location.pathname === '/contact');
  }, [location]);

  return (
    <>
      {isContactPage && (
        <>
          <Navbar />

          <div className="bg-Contact_Banner h-[76vh] mb-8 w-full bg-cover bg-center flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-800 via-blue-600 to-transparent opacity-30 z-10"></div>
            <motion.p
                       className="text-slate-50 justify-between text-6xl font-semibold text-center py-32 relative z-10"
                       initial={{ opacity: 0, y: -20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       transition={{ duration: 1 }}
                       viewport={{ once: true }}
                     >
                       Contact Us
                     </motion.p>
          </div>
        </>
      )}

      <img src="" className="bg-cover w-full" alt="" />

      <div className="mb-10 mx-6 mt-24" id="contact">
        {!isContactPage && (
          <>
            <motion.h2
              className="text-gray-600 font-bold text-2xl md:text-4xl mx-11 uppercase"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              Contact Us
            </motion.h2>
            <div className="relative flex items-center mx-4">
              <div className="w-8 h-8 bg-sky-600 rounded-full"></div>
              <div className="h-1 w-60 bg-sky-600"></div>
            </div>
          </>
        )}

        <form method="POST" className="mt-8 w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                id="username"
                required
                autoComplete="off"
                className="w-full p-2 border border-gray-300 rounded shadow-slate-100 shadow-md outline-none focus:border-sky-400 focus:border-2"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                id="email"
                required
                autoComplete="off"
                className="w-full p-2 border border-gray-300 rounded shadow-slate-100 shadow-md outline-none focus:border-sky-400 focus:border-2"
              />
            </div>
          </div>
          <div className="mt-6">
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              id="subject"
              required
              autoComplete="off"
              className="w-full p-2 border border-gray-300 rounded shadow-slate-100 shadow-md outline-none focus:border-sky-400 focus:border-2"
            />
          </div>
          <div className="mt-6">
            <textarea
              name="textarea"
              id="textarea"
              placeholder="Write here..."
              cols="30"
              rows="10"
              required
              minLength="5"
              className="w-full p-2 border border-gray-300 shadow-slate-100 shadow-md rounded resize-none outline-none focus:border-sky-400 focus:border-2"
            ></textarea>
          </div>
          <div className="mt-6">
            <input
              type="submit"
              name="submit"
              id="submit"
              className="btn bg-sky-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-sky-600"
              value="Send Message"
            />
          </div>
        </form>
      </div>

      {isContactPage && (
        <div className="mb-16 mx-auto flex justify-center mt-24">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1784.2492321810957!2d87.27676853851942!3d26.56837539318675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjbCsDM0JzA2LjEiTiA8N8KwMTYnNDEuMCJF!5e0!3m2!1sen!2snp!4v1731304162154!5m2!1sen!2snp"
            width="1500"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-md"
          ></iframe>
        </div>
      )}

      {isContactPage && <Footer />}
    </>
  );
};

export default Contact;
