import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import SearchDoctor from '../../Components/SearchComponent/SearchDoctor'


const FindDoctor = () => {
  return (
    <div>
    <Navbar />
    <div className='bg-Doctor_Banner bg-cover h-75vh flex flex-col justify-center items-center'>

       <h2 className='text-white font-bold font-sans mb-4 text-6xl'>Make An Appointment</h2>
       <SearchDoctor />
    </div>
      
    </div>
  )
}

export default FindDoctor
