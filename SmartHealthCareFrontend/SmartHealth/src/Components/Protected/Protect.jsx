import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from 'react-toastify';
const Protect = ({ children, requiredRole }) => {
  const navigateTo = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const token = Cookies.get("Token");

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        navigateTo("/"); // Redirect to login if no token
        return;
      }

      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.userId;
        const userRole = decodedToken.Role;
     
        // Validate token and user role
        const response = await axios.get(
          "https://localhost:7070/api/Auth/checkAccess",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response,"dewc")

        if(response.data == "Forbidden")
          {  Cookies.remove("Token"); 
            toast.info("Your Account has been suspended")
            navigateTo("/"); 
            return;
          }
          
        // Ensure the user's role matches the required role
        if (
          response.status === 200 &&
          response.data === userId &&
          requiredRole.includes(userRole)
        ) {
          setAuthenticated(true);
        } else {
          navigateTo("/unauthorize"); // Redirect if role doesn't match
        }
      }  catch (error) {
        console.error("Authentication check failed:", error);

        if (error.response?.status === 403) {
          Cookies.remove("Token"); 
          navigateTo("/");
        } else {
          navigateTo("/unauthorize");
        }
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

  return !token ? <>{children}</> : null;
};

export { Protect, RedirectIfAuthenticated };

