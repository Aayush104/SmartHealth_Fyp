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
     <motion.h2
        className="text-gray-600 font-bold text-2xl md:text-4xl mx-16 uppercase"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        TestiMonial
      </motion.h2>
      <div className="relative flex items-center mx-8">
        <div className="w-8 h-8 bg-sky-600 rounded-full"></div>
        <div className="h-1 w-64 bg-sky-600"></div>
      </div>
      <div className='flex flex-col items-center'>
       
      
    
        <motion.span
          className='font-bold text-Subheading capitalize font-comic'
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 25, delay: 0.2 }}
        >
          What our users have to say
        </motion.span>
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
              <p className='text-center mt-2 text-gray-600 text-lg'>
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
