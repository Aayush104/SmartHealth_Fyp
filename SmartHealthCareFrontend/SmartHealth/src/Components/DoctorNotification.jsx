import React, { useState, useEffect, useRef } from 'react';
import { IoIosNotifications } from "react-icons/io";
import * as signalR from '@microsoft/signalr';

const DoctorNotifications = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const notificationRef = useRef(null);
  const connectionRef = useRef(null);

  
  useEffect(() => {
    // Create SignalR connection
    connectionRef.current = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7070/notificationHub") 
      .withAutomaticReconnect()
      .build();

    // Start the connection
    connectionRef.current.start()
      .then(() => {
        console.log("SignalR Connected");
        // Fetch initial notifications after connection is established
        fetchNotifications();
      })
      .catch(err => console.error("SignalR Connection Error: ", err));

    // Handle received notifications
    connectionRef.current.on("ReceiveNotification", (message) => {
      console.log("🔔 New Notification Received:", message);
      
      const newNotification = {
        id: Date.now(), // Generate unique ID based on timestamp
        type: message.type || 'system',
        message: message.content || message,
        read: false,
        timestamp: new Date(),
        icon: getIconForType(message.type || 'system'),
        link: message.link || null
      };
      
      console.log("Adding notification to state:", newNotification);
      
      setNotifications(prev => {
        const updatedNotifications = [newNotification, ...prev];
        console.log("Updated notifications count:", updatedNotifications.length);
        console.log("Unread notifications:", updatedNotifications.filter(n => !n.read).length);
        return updatedNotifications;
      });
    });

    // Clean up the connection when component unmounts
    return () => {
      if (connectionRef.current) {
        console.log("Stopping SignalR connection");
        connectionRef.current.stop();
      }
    };
  }, []);

  // Function to fetch notifications from API
  const fetchNotifications = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('https://localhost:7070/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        console.error("Failed to fetch notifications:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Helper function to get icon based on notification type
  const getIconForType = (type) => {
    switch (type) {
      case 'appointment':
        return '🗓️';
      case 'message':
        return '💬';
      case 'review':
        return '⭐';
      case 'system':
        return '✅';
      default:
        return '📌';
    }
  };

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Count unread notifications
  const unreadCount = notifications.filter(notif => !notif.read).length;

  // Format time as "1m", "1h", "10h", "1d", etc.
  const formatTime = (timestamp) => {
    const now = new Date();
    const timestampDate = new Date(timestamp);
    const diffInHours = Math.round((now - timestampDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return `${Math.round((now - timestampDate) / (1000 * 60))}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      return `${Math.round(diffInHours / 24)}d`;
    }
  };

  const markAllAsRead = async () => {
    console.log("Marking all notifications as read");
    try {
      // Call API to mark all notifications as read
      const response = await fetch('https://localhost:7070/api/notifications/markAllRead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({...notif, read: true}))
        );
      } else {
        console.error("Failed to mark all notifications as read:", response.statusText);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const markAsRead = async (id) => {
    console.log("Marking notification as read:", id);
    try {
      // Call API to mark single notification as read
      const response = await fetch(`https://localhost:7070/api/notifications/${id}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === id ? {...notif, read: true} : notif
          )
        );
      } else {
        console.error(`Failed to mark notification ${id} as read:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
    }
  };

  // Handle notification click with navigation if link is provided
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  // Filter notifications based on showUnreadOnly state
  const filteredNotifications = showUnreadOnly 
    ? notifications.filter(n => !n.read)
    : notifications;

  const getNotificationContent = () => {
    if (filteredNotifications.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No notifications to display
        </div>
      );
    }
    
    return (
      <>
        <div className="px-4 py-2 flex justify-between items-center border-b">
          <div className="flex gap-4">
            <button 
              className={`text-sm font-medium ${!showUnreadOnly ? 'text-sky-500 border-b-2 border-sky-500' : 'text-gray-500'}`}
              onClick={() => setShowUnreadOnly(false)}
            >
              All
            </button>
            <button 
              className={`text-sm font-medium ${showUnreadOnly ? 'text-sky-500 border-b-2 border-sky-500' : 'text-gray-500'}`}
              onClick={() => setShowUnreadOnly(true)}
            >
              Unread
            </button>
          </div>
          <button 
            className="text-xs text-sky-500 hover:text-sky-600"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          <div className="text-xs text-gray-500 font-medium px-4 py-2">Earlier</div>
          
          {filteredNotifications.map(notification => (
            <div 
              key={notification.id}
              className={`px-3 py-2 border-b hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <div className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                    {notification.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTime(notification.timestamp)}
                  </div>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                )}
              </div>
            </div>
          ))}
          
          {notifications.length > 10 && (
            <div className="px-4 py-3 text-center">
              <button 
                className="text-sm text-sky-500 hover:text-sky-600"
                onClick={() => fetchMoreNotifications()}
              >
                See previous notifications
              </button>
            </div>
          )}
        </div>
      </>
    );
  };

  // Function to fetch older notifications
  const fetchMoreNotifications = async () => {
    try {
      const oldestNotificationId = Math.min(...notifications.map(n => n.id));
      const response = await fetch(`https://localhost:7070/api/notifications/older/${oldestNotificationId}`);
      
      if (response.ok) {
        const olderNotifications = await response.json();
        setNotifications(prev => [...prev, ...olderNotifications]);
      } else {
        console.error("Failed to fetch older notifications:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching older notifications:", error);
    }
  };

  useEffect(() => {
    // Log whenever unread count changes
    console.log(`Current unread notifications: ${unreadCount}`);
  }, [unreadCount]);

  return (
    <div className="relative" ref={notificationRef}>
      <li 
        className="flex flex-col justify-center items-center cursor-pointer text-gray-500 font-medium group hover:text-sky-400"
        onClick={() => {
          console.log(`Toggling notification panel. Current state: ${showNotifications ? 'open' : 'closed'}`);
          setShowNotifications(!showNotifications);
        }}
      >
        <div className="relative">
          <IoIosNotifications className="text-3xl mt-1 group-hover:text-sky-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <span className="mt-1">Notifications</span>
      </li>
      
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <h3 className="font-medium text-lg">Notifications</h3>
            <div className="text-gray-500 cursor-pointer hover:text-gray-700">
              {/* You could add settings icon here */}
              <span>•••</span>
            </div>
          </div>
          {getNotificationContent()}
        </div>
      )}
    </div>
  );
};

export default DoctorNotifications;