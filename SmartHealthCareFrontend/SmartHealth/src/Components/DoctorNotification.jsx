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
        fetchAnnouncements();
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));

    connectionRef.current.on("ReceiveNotification", (message) => {
      console.log("Received notification:", message);
      
      // Determine if message is an object with type or a string
      const messageType = typeof message === 'object' && message !== null ? message.type : 'system';
      const messageContent = typeof message === 'object' && message !== null ? message.content : message;
      
      const newNotification = {
        id: typeof message === 'object' && message !== null && message.id ? message.id : `notification-${Date.now()}`,
        type: messageType,
        message: messageContent,
        read: false,
        timestamp: new Date(),
        icon: getIconForType(messageType),
        link: typeof message === 'object' && message !== null && message.doctorId ? `/Doctors/${message.doctorId}` : null,
        doctorId: typeof message === 'object' && message !== null ? message.doctorId : null,
        markAs: 1,
        isMarked: false,
        title: typeof message === 'object' && message !== null ? message.title : null,
        description: typeof message === 'object' && message !== null ? message.description : null
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

          setNotifications(prev => [...formattedData, ...prev.filter(n => n.type !== "review")]);
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

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7070/api/Admin/GetAnnouncementNotification"
      );

      if (response.status === 200 && response.data.isSuccess) {
        const announcements = response.data.data.$values;
        
        // Convert announcements to notifications format
        const announcementNotifications = announcements.map(announcement => ({
          id: `announcement-${announcement.id}`,
          type: "announcement",
          message: `${announcement.title}: ${announcement.description}`,
          read: announcement.isMarked,
          timestamp: new Date(announcement.createdAt),
          icon: getIconForType("announcement"),
          link: null,
          markAs: announcement.isMarked ? 0 : 1,
          announcementId: announcement.id,
          isMarked: announcement.isMarked,
          title: announcement.title,
          description: announcement.description
        }));

        // Add announcements to notifications, preserving existing notifications
        setNotifications(prev => [
          ...announcementNotifications,
          ...prev.filter(n => n.type !== "announcement" || 
            !announcementNotifications.some(an => an.id === n.id))
        ]);
      } else {
        console.error("Failed to fetch announcements:", response.data.message || response.statusText);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
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
      case "announcement":
        return "📢";
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

  const markNotificationAsRead = async (notificationId) => {
    // Find the notification
    const notification = notifications.find(n => n.id === notificationId);
    
    if (!notification) return;
    
    try {
      // If it's an announcement notification
      if (notification.type === "announcement" && notification.announcementId) {
        // Mark specific announcement as read if needed
        // This would require a new API endpoint, but we're using markAllAsRead for now
      } else if (notification.doctorId) {
        // For doctor-specific notifications, you might want a specific endpoint
        // This would require a new API endpoint, but we're using markAllAsRead for now
      }
      
      // Update local state regardless
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n.id === notificationId ? { ...n, read: true, markAs: 0 } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all doctor notifications as read
  const markDoctorNotificationsAsRead = async () => {
    try {
      console.log("Attempting to mark all doctor notifications as read");
      const response = await axios.get(
        "https://localhost:7070/api/Doctor/MarkAllAsRead",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.status === 200) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notification => 
            notification.type !== "announcement" 
              ? { ...notification, markAs: 0, read: true } 
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking doctor notifications as read:", error);
    }
  };

  // Mark all announcements as read
  const markAllAnnouncementsAsRead = async () => {
    try {
      console.log("Attempting to mark all announcements as read");
      const response = await axios.get(
        "https://localhost:7070/api/Admin/MarkAllAnnouncementAsRead"
      );
      
      if (response.status === 200) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notification => 
            notification.type === "announcement" 
              ? { ...notification, read: true, markAs: 0, isMarked: true } 
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking announcements as read:", error);
    }
  };

  // Mark all notifications as read (both doctor notifications and announcements)
  const markAllAsRead = async () => {
    try {
      await markDoctorNotificationsAsRead();
      await markAllAnnouncementsAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const toggleNotifications = () => {
    const wasNotShowing = !showNotifications;
    setShowNotifications(!showNotifications);
    
    // When notifications are opening (not closing), mark all as read
    if (wasNotShowing) {
      markAllAsRead(); // This will call both APIs when opening the notifications
    }
  };

  // Only count notifications that are unread (markAs=1 or isMarked=false for announcements)
  const unreadCount = notifications.filter(
    (n) => (n.type === "announcement" && !n.isMarked) || 
           (n.markAs === 1 && !n.read)
  ).length;

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

  // Filter notifications based on showUnreadOnly setting
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
            <div className="flex gap-2">
              <button
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                className="text-sm text-sky-500"
              >
                {showUnreadOnly ? "Show All" : "Show Unread"}
              </button>
              <button
                onClick={markAllAsRead}
                className="text-sm text-sky-500"
              >
                Mark All Read
              </button>
            </div>
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