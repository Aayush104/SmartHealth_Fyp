import React, { useState, useEffect, useRef } from 'react';
import { IoIosNotifications } from "react-icons/io";
import * as signalR from '@microsoft/signalr';
import Cookies from 'js-cookie';

const DoctorNotifications = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const notificationRef = useRef(null);
  const connectionRef = useRef(null);

  const token = Cookies.get("Token");
  
  // Local storage key for read notifications
  const READ_NOTIFICATIONS_KEY = "doctor_read_notifications";

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

  // Load read notification IDs from localStorage
  const getReadNotificationIds = () => {
    try {
      const stored = localStorage.getItem(READ_NOTIFICATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  };

  // Save read notification IDs to localStorage
  const saveReadNotificationIds = (ids) => {
    try {
      localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(ids));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

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

      if (response.ok) {
        const responseData = await response.json();
        
        // Check if the data has the expected structure
        if (responseData.isSuccess && responseData.data && responseData.data.$values) {
          const notificationData = responseData.data.$values;
          
          // Get read notification IDs from localStorage
          const readNotificationIds = getReadNotificationIds();
          
          const formattedData = notificationData.map((notification) => ({
            id: notification.$id || notification.id || Date.now().toString(),
            doctorId: notification.doctorId,
            type: "review", // Assuming these are review notifications based on the data structure
            message: `${notification.userName} left a review: "${notification.reviewText}"`,
            read: readNotificationIds.includes(notification.$id || notification.id), // Check if it's read
            timestamp: new Date(notification.createdAt),
            icon: getIconForType("review"),
            link: `/Doctors/${notification.doctorId}`,
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

  const markAllAsRead = () => {
    // Mark all as read in state
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    
    // Update localStorage with all notification IDs
    const allIds = notifications.map(notification => notification.id);
    saveReadNotificationIds(allIds);
  };

  const markNotificationAsRead = (notificationId) => {
    // Mark as read in state
    setNotifications(prevNotifications => 
      prevNotifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    
    // Update localStorage
    const readIds = getReadNotificationIds();
    if (!readIds.includes(notificationId)) {
      readIds.push(notificationId);
      saveReadNotificationIds(readIds);
    }
  };

  const toggleNotifications = () => {
    const newShowState = !showNotifications;
    setShowNotifications(newShowState);
    
    // If opening notifications, mark all as read
    if (newShowState && notifications.some(n => !n.read)) {
      markAllAsRead();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
    // Mark as read
    if (!clickedNotification.read) {
      markNotificationAsRead(clickedNotification.id);
    }

    if (clickedNotification.link) {
      window.location.href = clickedNotification.link;
    }
  };

  const filteredNotifications = showUnreadOnly
    ? notifications.filter((n) => !n.read)
    : notifications;

  return (
    <div className="relative" ref={notificationRef}>
      <div
        className="cursor-pointer text-gray-500 font-medium group hover:text-sky-400"
        onClick={toggleNotifications}
      >
        <div className="relative">
          <div className="flex flex-col items-center">
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
              <div className="p-4 text-center text-gray-500">
                No notifications to display
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-3 py-2 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`text-sm ${
                          !notification.read ? "font-medium" : ""
                        }`}
                      >
                        {notification.message}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatTime(notification.timestamp)}
                      </div>
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