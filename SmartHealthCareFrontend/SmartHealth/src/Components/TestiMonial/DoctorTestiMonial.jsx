import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion'; // Import motion
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import testimonials from '../../Assets/Data/DoctorTestimonial.json';

const DoctorTestiMonial = () => {
  return (
    <div className=' h-50vh bg-gray-50 mt-16 '>
      <motion.span
        className='font-bold text-Subheading mx-suto my-0 text-center block pt-8  capitalize font-comic'
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 25, delay: 0.2 }}
      >
        What Doctor Say About Us
      </motion.span>

      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={20}
        autoplay={{ delay: 3000 }}
        loop={true}
        className='mt-6 mx-12'
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className='rounded-lg p-4 cursor-pointer'>
             
              <p className=' mt-2 text-gray-600 text-lg text-justify '>
                {testimonial.testimonial}
              </p>
              <div className='flex  items-center -mx-2 gap-4  mt-8 '>
              <img
                src={testimonial.image}
                alt={`${testimonial.name}'s testimonial`}
                className='rounded-full h-12 '
              />
              <div>
              <p className='font-semibold  text-xl'>{testimonial.name}</p>
              <p className=''>{testimonial.designation}</p>
              
              </div>
            
              </div>
              
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default DoctorTestiMonial;
