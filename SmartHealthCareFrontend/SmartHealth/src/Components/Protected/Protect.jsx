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
        const userRole = decodedToken.Role;
        const userName = decodedToken.Name;
        const name = userName.split(' ').join('_');

        const response = await axios.get("https://localhost:7070/api/Auth/checkAccess", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data === userId && requiredRole.includes(userRole)) {
          setAuthenticated(true);
          // Redirect based on role
          switch (userRole) {
            case "Admin":
              break;
            case "Patient":
              navigateTo('/home');
              break;
            case "Doctor":  
              navigateTo(`/DoctorProfile/${name}`);
              break;
  
          }
        } 
      } catch (error) {
        console.error("Authentication check failed:", error);
        navigateTo('/unAuthorized');
      }
    };

    checkAuth();
  }, [token, requiredRole, navigateTo]);

  
  return authenticated ? <>{children}</> : null;
};

const RedirectIfAuthenticated = ({ children }) => {
  const navigateTo = useNavigate();
  const token = Cookies.get("Token");

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userRole = decodedToken.Role;
        const userName = decodedToken.Name;
        const name = userName.split(' ').join('_');

        // Navigate based on the user role
        switch (userRole) {
          case "Admin":
            navigateTo('/admin/dashboard');
            break;
          case "Patient":
            navigateTo('/home');
            break;
          case "Doctor":
            navigateTo(`/DoctorProfile/${name}`);
            break;
          default:
            
            Cookies.remove("Token");
            navigateTo('/');
            break;
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
