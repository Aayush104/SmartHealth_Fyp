import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Link } from 'react-scroll';
import logo from '../../Assets/Image/Logo.png';
import { TbLogout2 } from "react-icons/tb";
import { HiMenuAlt3 } from "react-icons/hi"; 
import { IoIosAddCircleOutline, IoMdClose } from "react-icons/io"; 
import Cookies from 'js-cookie';
import { MdOutlineArrowDropDown } from 'react-icons/md';
import { GoReport } from "react-icons/go";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { BiTask } from "react-icons/bi";
const Navbar = () => {
  const location = useLocation();
  const [scrolling, setScrolling] = useState(false);
  const [icon, setIcon] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const token = Cookies.get("Token");
  const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : {};
  const userName = decodedToken.Name || "Doctor";
  

  useEffect(() => {
    setScrolling(location.pathname === '/');
    if (token) {
      setIcon(true);
    }
  }, [location, token]);

  const handleLogout = () => {
    Cookies.remove("Token");
    setIcon(false);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);



  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { 
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md cursor-pointer relative">
      <NavLink to="/">
        <img src={logo} alt="Medical Logo" className={`cursor-pointer ${
    icon ? 'w-28' : 'w-40'
  }`}/>
      </NavLink>

      {/* Desktop menu */}
      <div className="hidden lg:flex items-center sm:text-sm md:text-[1rem] lg:text-lg">
        <ul className="flex gap-8 text-sky-600 font-medium">
          <li className="hover:text-sky-500 transition-colors duration-200">
            <NavLink to="/">Home</NavLink>
          </li>
          <li className="hover:text-sky-500 transition-colors duration-200">
            <a href="/Doctors">Find Doctor</a>
          </li>
          <li className="hover:text-sky-500 transition-colors duration-200">
            <NavLink to="/AboutUs">About Us</NavLink>
          </li>
          <li className="hover:text-sky-500 transition-colors duration-200">
            {scrolling ? (
              <Link to="contact" smooth={true} duration={500}>
                Contact Us
              </Link>
            ) : (
              <NavLink to="/contact">Contact Us</NavLink>
            )}
          </li> 


          
          {!icon ? (


            <>
            <NavLink to ="/FAQ">
            <li className="hover:text-sky-500 transition-colors duration-200">
            Q & A
          </li>
          </NavLink>

            <li className="border border-gray-300 rounded-sm hover:border-sky-400 transition-colors duration-200">
              <NavLink to="/login">
                <span className="text-xs text-gray-500 font-normal px-2 py-2 block hover:text-sky-400">
                  Login / SignUp
                </span>
              </NavLink>
            </li>

          </>
          ) : (

<>
<NavLink to= "/chat"><li className="hover:text-sky-500 transition-colors duration-200">
            Message
          </li>
          </NavLink>

            <div className="relative group">
          <div className="flex items-center justify-between cursor-pointer">
          <img
                    src="https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
            <p className="text-sky-400 font-medium ml-2 capitalize">{userName}</p>
            <MdOutlineArrowDropDown className="text-2xl text-gray-500" />
          </div>
          <ul className="absolute mt-0.2 right-0 w-48 bg-white border rounded-lg shadow-lg hidden group-hover:block">

          <NavLink to ="/FAQ">
 <li className="px-4 py-2  hover:bg-gray-100 cursor-pointer flex items-center gap-2" >
 <BiTask/> Appointments
            </li>
            </NavLink>
            
          <NavLink to ="/FAQ">
 <li className="px-4 py-2  hover:bg-gray-100 cursor-pointer flex items-center gap-2" >
 <RiQuestionAnswerLine />       Q&A
            </li>
            </NavLink>

            
            <NavLink to ="/Reports">
 <li className="px-4 py-2  hover:bg-gray-100 cursor-pointer flex items-center gap-2" >
 <GoReport />         Do Report
            </li>
            </NavLink>

         




            <NavLink to="/" onClick={handleLogout} >
          <li className=" py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
              <div className='flex items-center px-2 py-2'>
                <TbLogout2 className="text-lg text-sky-600  mr-1 " />
                <span className="text-md text-sky-600 font-medium  ">
                  Logout
                </span>
                </div>
            </li>
            </NavLink>
          </ul>
        </div>
        </>
          )}
        </ul>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <IoMdClose className="text-sky-600 text-3xl" />
          ) : (
            <HiMenuAlt3 className="text-sky-600 text-3xl" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-white z-50 lg:hidden">
          <div className="flex justify-between items-center p-4 border border-e-green-400">
            <NavLink to="/">
              <img src={logo} alt="Medical Logo" className="w-44 cursor-pointer" />
            </NavLink>

            <button onClick={() => setMenuOpen(false)}>
              <IoMdClose className="text-sky-600 text-3xl" />
            </button>
          </div>
          <ul className="flex flex-col  text-sky-600 font-medium space-y-8  text-lg p-6">
            <li className="hover:text-sky-500 transition-colors duration-200 ">
              <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
            </li>
            <li className="hover:text-sky-500 transition-colors duration-200">
              <a href="/Doctors" onClick={() => setMenuOpen(false)}>Find Doctor</a>
            </li>
            <li className="hover:text-sky-500 transition-colors duration-200">
              <NavLink to="/AboutUs" onClick={() => setMenuOpen(false)}>About Us</NavLink>
            </li>
            <li className="hover:text-sky-500 transition-colors duration-200">
              {scrolling ? (
                <Link to="contact" smooth={true} duration={500} onClick={() => setMenuOpen(false)}>
                  Contact Us
                </Link>
              ) : (
                <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</NavLink>
              )}
            </li>
            <li className="hover:text-sky-500 transition-colors duration-200">
              <a href="#" onClick={() => setMenuOpen(false)}>Q & A</a>
            </li>
      



            {!icon ? (
              <li className="border border-gray-300 w-36 rounded-sm hover:border-sky-400 transition-colors duration-200 
              ">
                <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                  <span className="text-sm text-gray-600 font-normal px-6 flex items-center justify-center p-2 hover:text-sky-400">
                    Login / Signup
                  </span>
                </NavLink>
              </li>
            ) : (
              <li className="border w-24 border-gray-300 rounded-sm hover:border-sky-400 transition-colors duration-200">
                <NavLink to="/" onClick={() => { handleLogout(); setMenuOpen(false); }} className="flex items-center justify-center px-2 py-2">
                  <TbLogout2 className="text-lg text-gray-500 mr-1 hover:text-sky-400" />
                  <span className="text-xs text-gray-500 font-normal hover:text-sky-400">
                    LogOut
                  </span>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;