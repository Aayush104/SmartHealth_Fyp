import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Helper = () => {
    const [isLogin, setIsLogin] = useState(false);
    const location = useLocation();

    useEffect(() => {
        
        if (location.pathname === '/login') {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    }, [location]);

    return (
        <div className='flex flex-col items-center'>
            <div className='flex gap-16 text-center items-center justify-center mt-8'>
                {isLogin ? (
                    <>
                        <p className='cursor-pointer text-sky-500 hover:underline'>
                            Login
                        </p>
                        <NavLink to= '/patientRegistration'>
                        <p className='cursor-pointer hover:text-sky-500 hover:underline'>
                            Register
                        </p>
                        </NavLink>
                    </>
                ) : (
                    <>

                    <NavLink to = '/login'>
                        <p className='cursor-pointer hover:text-sky-500 hover:underline'>
                            Login
                        </p>
                        </NavLink>
                     
                        <p className='cursor-pointer text-sky-500 hover:underline'>
                            Register
                        </p>

                    </>
                )}
            </div>
            <div className='w-1/2 border-b border-gray-200 mt-2'></div>
        </div>
    );
};

export default Helper;
