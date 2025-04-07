import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { IoIosNotifications } from 'react-icons/io';
import * as signalR from '@microsoft/signalr';

const AdminNotification = () => {
  // State to manage dropdown visibility and notifications
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const connectionRef = useRef(null);

  // Format the timestamp to relative time (just now, x minutes ago, x hours ago, etc.)
  const getTimeString = (timestamp) => {
    const createdAt = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - createdAt) / 1000);
    
    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  // Generate user initials for avatar placeholder
  const getUserInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  // Generate notification message based on report type and category
  const generateMessage = (notification) => {
    const prefix = notification.reportType === "Issue" 
      ? "reported an issue" 
      : "made a request";
    
    const displayName = notification.role === "Doctor" ? `Dr. ${notification.userName}` : notification.userName;
    return `${displayName} ${prefix} in ${notification.category} category with ${notification.urgency} urgency.`;
  };

  // Transform API data to consistent notification format
  const formatNotification = (item) => {
    return {
      id: item.id || Date.now(),
      title: item.subject,
      message: generateMessage(item),
      time: getTimeString(item.createdAt),
      isRead: item.markAs,
      userName: item.userName,
      role: item.role,
      urgency: item.urgency,
      reportType: item.reportType,
      category: item.category,
      createdAt: item.createdAt
    };
  };

  // Fetch notification data
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://localhost:7070/api/Admin/GetReport");
      
      if (response.data.data.$values && Array.isArray(response.data.data.$values)) {
        const formattedNotifications = response.data.data.$values.map(formatNotification);
        setNotifications(formattedNotifications);
      } else {
        console.error("Unexpected API response format:", response.data);
        setError("Invalid data format received");
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
      setLoading(false);
    }
  };


  useEffect(() => {
    connectionRef.current = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7070/notificationHub")
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Debug) 
      .build();

   
    connectionRef.current
      .start()
      .then(() => {
        console.log("SignalR Connected successfully");
        fetchNotifications();
      })
      .catch((err) => {
        console.error("SignalR Connection Error: ", err);
       
        if (err.errorType === 'FailedToNegotiateWithServerError') {
          console.error("Negotiation failed - CORS or endpoint issue");
        }
      });

    // Handle incoming notifications
    connectionRef.current.on("ReceiveNotificationForAdmin", (notification) => {
      console.log("Received notification for admin:", notification);
      
      // Handle notifications in a consistent format
      if (typeof notification === 'string') {
        // If it's just a string, create a minimal notification object
        const newNotification = {
          id: Date.now(),
          subject: "System Notification",
          userName: "System",
          role: "System",
          urgency: "Medium",
          reportType: "System",
          category: "Notification",
          createdAt: new Date().toISOString(),
          markAs: false
        };
        
        // Format and add the new notification
        setNotifications(prev => [formatNotification(newNotification), ...prev]);
      } else {
        // If it's an object, process it directly
        setNotifications(prev => [formatNotification(notification), ...prev]);
      }
    });

    // Log notifications for debugging
    console.log("Current notifications:", notifications);

    // Cleanup function
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Count unread notifications (markAs = false)
  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  // Mark all as read
  const markAllAsRead = async (e) => {
    e.stopPropagation();
    try {
      // Call the API to mark all notifications as read
      const response = await axios.post("https://localhost:7070/api/Admin/MarkAsRead");
      
      if (response.data.isSuccess) {
        // Update local state only if the API call was successful
        setNotifications(notifications.map(notif => ({...notif, isRead: true})));
      } else {
        console.error("Error marking notifications as read:", response.data.message);
      }
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  // Handle notification icon click - separate from dropdown toggle
  const handleNotificationIconClick = (e) => {
    e.stopPropagation();
    markAllAsRead(e);
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-center cursor-pointer" onClick={toggleDropdown}>
        <div className="relative">
          <div onClick={handleNotificationIconClick}>
            <IoIosNotifications className="text-4xl text-gray-700 hover:text-blue-600 transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm mt-1">Notifications</p>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            {unreadCount > 0 && (
              <span 
                className="text-xs text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={markAllAsRead}
              >
                Mark all as read
              </span>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                {error}
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {/* Always show initials avatar */}
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
                        {getUserInitials(notification.userName)}
                      </div>
                      <h4 className="font-medium text-gray-800">
                        {notification.title}
                        <span className={`ml-2 text-xs px-2 py-1 rounded ${
                          notification.urgency === "High" ? 'bg-red-100 text-red-800' :
                          notification.urgency === "Medium" ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {notification.urgency}
                        </span>
                      </h4>
                    </div>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {notification.reportType}
                    </span>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                      {notification.category}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                      {notification.role}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotification;