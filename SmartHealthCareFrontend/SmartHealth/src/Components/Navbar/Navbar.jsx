import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Link } from 'react-scroll';
import logo from '../../Assets/Image/Logo.png';
import { TbLogout2 } from "react-icons/tb";
import Cookies from 'js-cookie';

const Navbar = () => {
  const location = useLocation();
  const [scrolling, setScrolling] = useState(false);
  const [icon, setIcon] = useState(false);
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

  return (
    <nav className="flex items-center justify-around shadow-md p-1 bg-white cursor-pointer">
      <NavLink to="/">
        <div>
          <img src={logo} alt="Medical Logo" className="w-44 cursor-pointer" />
        </div>
      </NavLink>
      <div>
        <ul className="flex gap-8 text-sky-600 font-medium items-center">
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
    </nav>
  );
};

export default Navbar;
