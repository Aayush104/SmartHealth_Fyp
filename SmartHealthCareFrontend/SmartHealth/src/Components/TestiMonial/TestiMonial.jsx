import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion'; // Import motion
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import testimonials from '../../Assets/Data/Testimonials.json';

const Testimonial = () => {
  return (
    <div className='mt-20 mb-8'>
    
    <div className="flex flex-col items-center mb-12">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium uppercase tracking-wider"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 25, delay: 0.2 }}
            >
              Testimonials
            </motion.span>
            
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-800 mt-4 text-center"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 25, delay: 0.3 }}
            >
              What Our Users Have to Say
            </motion.h2>
            
            <motion.div
              className="h-1 w-24 bg-blue-500 mt-4 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
          </motion.div>
        </div>

      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={3}           
        spaceBetween={20}          
        autoplay={{ delay: 3000 }}
        loop={true}
        className='mt-6 mx-12'
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className='shadow-md rounded-lg border p-4 cursor-pointer'>
              <img
                src={testimonial.image}
                alt={`${testimonial.name}'s testimonial`}
                className='rounded-full w-16 h-16 mb-4 mx-auto'
              />
              <p className='font-semibold text-center text-xl'>{testimonial.name}</p>
              <p className='text-center mt-2 text-gray-600 text-md'>
                {testimonial.testimonial}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonial;
