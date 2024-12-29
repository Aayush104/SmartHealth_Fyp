import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Link } from 'react-scroll';
import logo from '../../Assets/Image/Logo.png';
import { TbLogout2 } from "react-icons/tb";
import { HiMenuAlt3 } from "react-icons/hi"; 
import { IoMdClose } from "react-icons/io"; 
import Cookies from 'js-cookie';

const Navbar = () => {
  const location = useLocation();
  const [scrolling, setScrolling] = useState(false);
  const [icon, setIcon] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const token = Cookies.get("Token");

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


  //Yesley automatically resize flase gardinxa
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
        <img src={logo} alt="Medical Logo" className="w-44 cursor-pointer" />
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
          <li className="hover:text-sky-500 transition-colors duration-200">
            <a href="#">Q & A</a>
          </li>
          {!icon ? (
            <li className="border border-gray-300 rounded-sm hover:border-sky-400 transition-colors duration-200">
              <NavLink to="/login">
                <span className="text-xs text-gray-500 font-normal px-2 py-2 block hover:text-sky-400">
                  Login / SignUp
                </span>
              </NavLink>
            </li>
          ) : (
            <li className="border border-gray-300 rounded-sm hover:border-sky-400 transition-colors duration-200">
              <NavLink to="/" onClick={handleLogout} className="flex items-center justify-center px-2 py-2">
                <TbLogout2 className="text-lg text-gray-500 mr-1 hover:text-sky-400" />
                <span className="text-xs text-gray-500 font-normal hover:text-sky-400">
                  LogOut
                </span>
              </NavLink>
            </li>
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
              <li className="border border-gray-300 rounded-sm hover:border-sky-400 transition-colors duration-200">
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