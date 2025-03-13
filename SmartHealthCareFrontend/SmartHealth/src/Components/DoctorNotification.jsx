import React, { useState, useEffect, useRef } from 'react';
import { IoIosNotifications } from "react-icons/io";
import * as signalR from '@microsoft/signalr';
import Cookies from 'js-cookie';
import axios from 'axios';

const DoctorNotifications = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const notificationRef = useRef(null);
  const connectionRef = useRef(null);

  const token = Cookies.get("Token");

  useEffect(() => {
    connectionRef.current = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7070/notificationHub")
      .withAutomaticReconnect()
      .build();

    connectionRef.current
      .start()
      .then(() => {
        console.log("SignalR Connected");
        fetchNotifications();
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));

    connectionRef.current.on("ReceiveNotification", (message) => {
      const newNotification = {
        id: message.id || Date.now().toString(),
        type: message.type || "system",
        message: message.content || message,
        read: false,
        timestamp: new Date(),
        icon: getIconForType(message.type || "system"),
        link: message.link || null,
        doctorId: message.doctorId || null,
        markAs: message.markAs !== undefined ? message.markAs : 1,
      };

      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => {
      if (connectionRef.current) {
        connectionRef.current.off("ReceiveNotification");
        connectionRef.current.stop();
      }
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        "https://localhost:7070/api/Doctor/GetNotifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Notification", response);

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.isSuccess && responseData.data && responseData.data.$values) {
          const notificationData = responseData.data.$values;

          const formattedData = notificationData.map((notification) => ({
            id: notification.$id || notification.id || Date.now().toString(),
            doctorId: notification.doctorId,
            type: "review",
            message: `${notification.userName} left a review: "${notification.reviewText}"`,
            read: false,
            timestamp: new Date(notification.createdAt),
            icon: getIconForType("review"),
            link: `/Doctors/${notification.doctorId}`,
            markAs: notification.markAs,
          }));

          setNotifications(formattedData);
        } else {
          console.error("Unexpected data structure:", responseData);
        }
      } else {
        console.error("Failed to fetch notifications:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "appointment":
        return "🗓️";
      case "message":
        return "💬";
      case "review":
        return "⭐";
      case "system":
        return "✅";
      default:
        return "📌";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Only count notifications with markAs=1 in the unread count
  const unreadCount = notifications.filter((n) => !n.read && n.markAs === 1).length;

  const formatTime = (timestamp) => {
    const now = new Date();
    const timestampDate = new Date(timestamp);
    const diffInMinutes = Math.round((now - timestampDate) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.round(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    return `${Math.round(diffInHours / 24)}d`;
  };

  const handleNotificationClick = (clickedNotification) => {
    if (!clickedNotification.read) {
      markNotificationAsRead(clickedNotification.id);
    }

    if (clickedNotification.link) {
      window.location.href = clickedNotification.link;
    }
  };

  // Filter notifications based only on showUnreadOnly setting
  // Don't filter based on markAs - show all notifications
  const filteredNotifications = showUnreadOnly
    ? notifications.filter((n) => !n.read)
    : notifications;

    const Markasread = async ()=>
    {
      const response = await axios.get("https://localhost:7070/api/Doctor/MarkAllAsRead",
        {
          
            headers: {
              Authorization: `Bearer ${token}`,
            },
          
        }

       
      )

      if(response.status == 200)
      {
        setNotifications(prevNotifications =>
          prevNotifications.map(notification => ({
            ...notification,
            markAs: 0,
            read: true
          }))
        );
      }
      
    }

  return (
    <div className="relative" ref={notificationRef}>
      <div
        className="cursor-pointer text-gray-500 font-medium group hover:text-sky-400"
        onClick={toggleNotifications}
      >
        <div className="relative">
          <div className="flex flex-col items-center" onClick={Markasread}>
            <IoIosNotifications className="text-4xl" /> 
            <p>Notifications</p>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-0.5 mr-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <h3 className="font-medium text-lg">Notifications</h3>
            <button
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              className="text-sm text-sky-500"
            >
              {showUnreadOnly ? "Show All" : "Show Unread"}
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications to display</div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-3 py-2 border-b hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm ${!notification.read ? "font-medium" : ""}`}>{notification.message}</div>
                      <div className="text-xs text-gray-500 mt-1">{formatTime(notification.timestamp)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorNotifications;