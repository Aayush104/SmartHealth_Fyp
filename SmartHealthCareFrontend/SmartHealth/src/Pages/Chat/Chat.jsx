import React, { useEffect, useState } from 'react';
import { MessageCircle, PlusCircle, Send, Mic, Paperclip, Search, User } from 'lucide-react';
import Navbar from '../../Components/Navbar/Navbar';
import axios from 'axios';
import Cookies from "js-cookie";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey this is Harsha Kakikeri, how can I help you?", sender: "doctor", time: "9:30 am" },
    { id: 2, text: "Hey this is Shishir, I need your help. Please help me", sender: "user", time: "9:31 am" },
    { id: 3, text: "I understand you need assistance. Could you please describe what's troubling you?", sender: "doctor", time: "9:32 am" }
  ]);

  const recentMessages = [
    { name: "Harsha Kakikeri", message: "Hey Hey! How's it going?" },
    { name: "Manjunath Islam", message: "Your next checkup..." },
    { name: "Caroline", message: "Test results are ready" }
  ];

const token = Cookies.get("Token")

useEffect(() => {
  const fetchData = async () => {
    const response = await axios.get("https://localhost:7070/api/Chat/GetUserForChat", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("userlist", response);
  };

  fetchData();
}, []); 


  return (
    <>
      <Navbar />
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
              {recentMessages.map((msg, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 hover:bg-blue-600 rounded-lg cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{msg.name}</p>
                    <p className="text-xs opacity-80">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-16 border-b flex items-center justify-between px-6">
            <h2 className="text-xl font-semibold">Harsha Kakikeri</h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md p-4 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-sky-500 border text-white'
                      : 'bg-gray-100 border text-gray-800'
                  }`}
                >
                  <p>{message.text}</p>
                  <span className="text-xs opacity-75 mt-1 block">{message.time}</span>
                </div>
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
      </div>
    </>
  );
};

export default Chat;
