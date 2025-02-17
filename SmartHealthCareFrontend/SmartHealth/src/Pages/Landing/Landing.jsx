import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Hero from '../../Components/Hero/Hero'
import WorkingProcess from '../../Components/How We Work/WorkingProcess'
import Banner from '../../Components/How We Work/Banner'
import TestiMonial from '../../Components/TestiMonial/TestiMonial'
import Fotter from '../../Components/Fotter/Fotter'
import Contact from '../../Components/Contact/Contact'
import ChatBot from '../../Components/Chat/ChatBot'


const Landing = () => {
  return (
    <div className='bg-slate-50'>
    <ChatBot />
    <Navbar />
    <Hero />
  
    <WorkingProcess />
    <Banner />
    <Contact />
    <TestiMonial />
    <Fotter />

      
    </div>
  )
}

export default Landing
