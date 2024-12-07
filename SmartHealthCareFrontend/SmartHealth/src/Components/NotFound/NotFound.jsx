import React from 'react'
import Navbar from '../Navbar/Navbar'
import SearchDoctor from '../SearchComponent/SearchDoctor'
import Footer from '../Fotter/Fotter'

const NotFound = () => {
  return (
    <div>
    <Navbar />
     <div className='flex justify-center items-center h-75vh'>
     <div className='flex justify-center items-center gap-20'>
        <p className='text-4rem font-bold'>404</p>
        <div className='flex gap-4 flex-col justify-center mt-16'>
        <p className='text-6xl font-semibold'>Ooops</p>

        <p className='text-2xl font-semibold'>The page you were looking for couldn't be found.</p>
<SearchDoctor />
        </div>
     </div>
     </div>
     <Footer />
    </div>
  )
}

export default NotFound
