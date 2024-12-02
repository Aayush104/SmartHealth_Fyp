import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const Protect = ({ children, requiredRole }) => {
  const navigateTo = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const token = Cookies.get("Token");

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        navigateTo('/');
        return;
      }

      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.userId;
        const userRole = decodedToken.Name;
        console.log(userRole)

        const response = await axios.get("https://localhost:7070/api/Auth/checkAccess", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data === userId && requiredRole.includes(userRole)) {
          setAuthenticated(true);
        } else {
          navigateTo('/unAuthorized');
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        navigateTo('/unAuthorized');
      }
    };

    checkAuth();
  }, [token, navigateTo, requiredRole]);

  return authenticated ? <>{children}</> : null;
};

const RedirectIfAuthenticated = ({ children }) => {
    const navigateTo = useNavigate();
    const token = Cookies.get("Token");
  
    useEffect(() => {
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          const userRole = decodedToken.Name;
  
          // Navigate based on the user role
          if (userRole === "Admin") {
            navigateTo('/admin/dashboard');
          } else if (userRole === "Patient") {
            navigateTo('/home');
          } else if (userRole === "Doctor") {
            navigateTo('/DoctorProfile');
          } else {
            // Unknown role, clear the token and redirect to login
            Cookies.remove("Token");
            navigateTo('/');
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          Cookies.remove("Token");
          navigateTo('/');
        }
      }
    }, [token, navigateTo]);
  
    // Render children only if no token is present
    return !token ? <>{children}</> : null;
  };
export { Protect, RedirectIfAuthenticated };
