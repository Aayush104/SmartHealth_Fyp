import React, { useEffect, useState, useRef } from 'react'; 
import { MessageCircle, PlusCircle, Send, Mic, Paperclip, Search } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import Cookies from "js-cookie";
import DoctorNav from '../Navbar/DoctorNav';
import { FaHandHoldingHeart } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa6";
import * as signalR from '@microsoft/signalr';
import sendsounds from '../../Assets/Music/SendSound.mp3';


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState([]);
  const [isDoctor, setIsDoctor] = useState(false);
  const [connection, setConnection] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userId, setUserId] = useState(null); 
  const [message, setMessage] = useState(""); 
  const [isEmptyConvo, setisEmptyConvo] = useState(false);
  const messagesEndRef = useRef(null); 

  const token = Cookies.get("Token");
  const sendSound = new Audio(sendsounds);

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

        const usersWithLastMessage = await Promise.all(response.data.data.$values.map(async (user) => {
          const messageResponse = await axios.get(`https://localhost:7070/api/Chat/GetMessages/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const lastMessage = messageResponse.data.$values && messageResponse.data.$values.length > 0
            ? messageResponse.data.$values[messageResponse.data.$values.length - 1]
            : setisEmptyConvo(true);
          return { ...user, lastMessage };
        }));
        setUserName(usersWithLastMessage || []);
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      sendMessage();
    }
  };

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

  // SignalR configuration
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7070/hub', {
        accessTokenFactory: () => token,
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    newConnection.onclose(() => {
      console.log('SignalR connection closed');
    });

    newConnection.onreconnecting(() => {
      console.log('SignalR reconnecting...');
    });

    newConnection.onreconnected(() => {
      console.log('SignalR reconnected');
    });

    newConnection.start()
      .then(() => {
        console.log('SignalR connected');
        setConnection(newConnection);
      })
      .catch(err => {
        console.error('SignalR connection error:', err);
      });

    return () => {
      if (newConnection) {
        newConnection.stop()
          .then(() => console.log('SignalR connection stopped'))
          .catch(err => console.error('Error stopping SignalR connection:', err));
      }
    };
  }, [token]);

  useEffect(() => {
    if (connection) {
      connection.on('ReceiveMessage', (senderId, message) => {
        // Update the last message for the user in the sidebar
        setMessages(prevMessages => [...prevMessages, { senderId, messageContent: message, sentAt: new Date().toISOString() }]);

        setisEmptyConvo(false)
        // Update the recent message for the sender/receiver
        setUserName((prevUserName) => {
          return prevUserName.map((user) => {
            if (user.id === senderId || user.id === userId) {
              return {
                ...user,
                lastMessage: { senderId, messageContent: message }
              };
            }
            return user;
          });
        });
      });
    }
  }, [connection, userId]);

  const sendMessage = async () => {
    if (!message || !selectedUser?.id || !userId || !connection) {
      console.log('Invalid parameters');
      return;
    }
    if (connection && selectedUser.id && message) {
      try {
        await connection.invoke('SendMessage', userId, selectedUser.id.toString(), message);
        console.log('Message sent');
        sendSound.play();
        setisEmptyConvo(false)
        // Update the recent message for the selected user
        setUserName(prevUserName => {
          return prevUserName.map(user => {
            if (user.id === selectedUser.id) {
              return { ...user, lastMessage: { senderId: userId, messageContent: message } };
            }
            return user;
          });
        });
        setMessage('');
      } catch (err) {
        console.error('Error sending message:', err);
      }
    } else {
      console.error('Invalid parameters');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* {isDoctor ? <DoctorNav /> : <Navbar />} */}

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
                       <p className="text-lg font-medium">{user.name}</p>
                     ) : (
                       <p className="text-lg font-medium">Dr. {user.name}</p>
                     )}
                     <p
                       className={`text-sm opacity-90 ${user.lastMessage && user.lastMessage.senderId !== userId ? 'font-bold text-md' : ''}`}
                     >
                       {user.lastMessage ? user.lastMessage.messageContent : "No recent message"}
                     </p>
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

            {/* Chat messages */}

            {
              isEmptyConvo ? 

<div className="flex-1 flex flex-col justify-center items-center space-y-6 p-8 bg-gradient-to-b from-blue-50 to-white">
  <div className="flex flex-col items-center space-y-4">
    <div className="bg-blue-100 p-4 rounded-full">
      <MessageCircle className="w-12 h-12 text-blue-600" />
    </div>
    <h2 className="text-3xl font-bold text-gray-800">Let's Get Chatting!</h2>
    <p className="text-lg text-gray-600 text-center">Your next great conversation starts here. Connect, share, and explore!</p>
  </div>

  <p className="text-sm text-gray-500 mt-6">Smart Health is here to simplify your life. Start your journey towards better living today!</p>
</div>

:(
                <div className="flex-1 overflow-auto p-6">
              {Object.keys(groupedMessages).map((date) => (
                <div key={date} className="mb-4">
                  <p className="text-xs font-semibold text-center text-gray-500">{date}</p>
                  <div className="space-y-4">
                    {groupedMessages[date].map((message, index) => (
                      <div key={index} className="flex gap-2">
                        <div className={`flex items-center ${message.senderId === userId ? 'ml-auto' : ''}`}>
                          <div
                            className={`p-3 max-w-xs rounded-lg text-white ${
                              message.senderId === userId ? 'bg-sky-500' : 'bg-cyan-500'
                            }`}
                          >
                            {message.messageContent}
                            <p className="text-xs text-right opacity-60">{new Date(message.sentAt).toLocaleTimeString()}</p>
                            
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
              )
            }
            

            <div className="flex items-center p-4 bg-white shadow-md border-t">
              <input
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full flex flex-wrap p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                onClick={sendMessage}
                className="ml-2 text-blue-600"
              >
                <Send />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
