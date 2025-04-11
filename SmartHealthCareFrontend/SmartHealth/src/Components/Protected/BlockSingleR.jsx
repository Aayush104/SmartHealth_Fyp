import { HubConnectionBuilder } from '@microsoft/signalr';
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import 

const BlockSingleR = () => {
  const token = Cookies.get("Token");
  let userId;
  
  if(token) {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    userId = decodedToken.userId;
  }
  
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7070/userhub")
      .withAutomaticReconnect()
      .build();
      
    connection.start().then(() => {
      console.log("Connected to SingleR");
      if (userId) {
        connection.invoke("AddUserToGroup", userId)
          .catch(err => console.error("Error adding to group:", err));
      }
    }).catch(err => {
      console.error("SignalR Connection Error:", err);
    });
    
    connection.on("Logout", () => {
      toast.info("You have been Blocked bY the Admin");
      Cookies.remove("Token");
      window.location.href = "/login";
    });
    
    return () => {
      connection.stop();
    };
  }, [userId]); // Added userId to dependency array
  
  return null;
};

export default BlockSingleR;