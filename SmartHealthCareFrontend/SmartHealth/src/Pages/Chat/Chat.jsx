import React, { useEffect, useState } from 'react';
import { MessageCircle, PlusCircle, Send, Mic, Paperclip, Search } from 'lucide-react';
import Navbar from '../../Components/Navbar/Navbar';
import axios from 'axios';
import Cookies from "js-cookie";
import DoctorNav from '../../Components/Navbar/DoctorNav';
import { FaHandHoldingHeart } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa6";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userName, setuserName] = useState([]);
  const [isDoctor, setIsDoctor] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userId, setUserId] = useState(null); 
  const [userProfile, setUserProfile] = useState("")

  const token = Cookies.get("Token");

  useEffect(() => {
    if (!token) return;

    // Extract userId and role from token
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const role = decodedToken.Role;
    setUserId(decodedToken.userId); // Set the userId in state
    if (role === "Doctor") {
      setIsDoctor(true);
    }

    // Fetch users for chat
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7070/api/Chat/GetUserForChat", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setuserName(response.data.data.$values || []);
       
      } catch (error) {
        console.error("Error fetching users for chat:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleUserClick = async (user) => {
    setSelectedUser(user);

    // Fetch messages for the selected user
    try {
      const response = await axios.get(`https://localhost:7070/api/Chat/GetMessages/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data.$values || []);
      console.log("Messages:", response);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const placeholderImage = "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg";

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const messageDate = new Date(message.sentAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!acc[messageDate]) {
        acc[messageDate] = [];
      }
      acc[messageDate].push(message);
      return acc;
    }, {});
  };
  
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <>
      {isDoctor ? <DoctorNav /> : <Navbar />}

      <div className="flex h-[90vh] bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-sky-500 text-white p-4">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Chats</h2>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
              />
            </div>

            {/* Recent Messages */}
            <div className="space-y-2">
              {userName.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 hover:bg-sky-300 rounded-lg cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="w-12 h-12 rounded-full bg-sky-200 overflow-hidden">
                    <img
                      src={user.profile || placeholderImage}
                      alt="User profile"
                      className="w-12 h-12 object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    {isDoctor ? (
                      <p className="text-md font-medium">{user.name}</p>
                    ) : (
                      <p className="text-md font-medium">Dr. {user.name}</p>
                    )}
                    <p className="text-xs opacity-80">{user.message || "No recent message"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        {!selectedUser ? (
          <div className="flex-1 flex flex-col justify-center items-center space-y-6 p-8 bg-gradient-to-b from-blue-50 to-white">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <MessageCircle className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Welcome to SmartHealth Chat</h2>
              <p className="text-lg text-gray-600 text-center">Start your healthcare journey with instant medical consultations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">Easy Scheduling</h3> <FaRegCalendarCheck />
                  </div>
                  <p className="text-sm text-gray-600">Book appointments with just a few clicks</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">Expert Care</h3> <FaHandHoldingHeart />
                  </div>
                  <p className="text-sm text-gray-600">Connect with qualified healthcare professionals</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-6">Select a chat to begin your consultation</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
          
            <div className="h-20 border-b flex gap-2  px-6  items-center">
            <div className="w-12 h-12 rounded-full bg-sky-200 overflow-hidden">
                    <img
                      src={selectedUser.profile || placeholderImage}
                      alt="User profile"
                      className="w-12 h-12 object-cover"
                    />
                  </div>
                  {isDoctor ? (
                      <p className="text-xl font-medium">{selectedUser.name}</p>
                    ) : (
                      <p className="text-xl font-medium">Dr. {selectedUser.name}</p>
                    )}
            </div>

        
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
            

{Object.entries(groupedMessages).map(([date, dailyMessages]) => (
  <div key={date}>
    <div className="text-center my-4">
      <h3 className="text-sm font-semibold text-gray-600">{date}</h3>
    </div>

    {/* Display Messages for this Date */}
    {dailyMessages.map((message) => (
      <div
        key={message.id}
        className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-md p-4 rounded-lg ${
            message.senderId === userId
              ? 'bg-sky-500 border text-white'
              : 'bg-gray-100 border text-gray-800'
          }`}
        >
          <p>{message.messageContent}</p>
          <span className="text-xs opacity-75 mt-1 block">
            {new Date(message.sentAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </span>
        </div>
      </div>
    ))}
  </div>
))}

            </div>

            {/* Input Area */}
            <div className="h-20 border-t p-4">
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Paperclip className="w-4 h-4 text-gray-500" />
                </button>
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Mic className="w-4 h-4 text-gray-500" />
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
