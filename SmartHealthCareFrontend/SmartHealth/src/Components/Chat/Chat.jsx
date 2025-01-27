import React, { useEffect, useState, useRef } from 'react';
import { MessageCircle, Send, Search } from 'lucide-react';
import axios from 'axios';
import Cookies from "js-cookie";
import * as signalR from '@microsoft/signalr';
import sendsounds from '../../Assets/Music/SendSound.mp3';
import { RiAttachment2 } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { FaRegCalendarCheck, FaHandHoldingHeart } from "react-icons/fa";
import Resizer from 'react-image-file-resizer';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isDoctor, setIsDoctor] = useState(false);
  const [connection, setConnection] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [isEmptyConvo, setIsEmptyConvo] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const messagesEndRef = useRef(null);
  const token = Cookies.get("Token");
  const sendSound = new Audio(sendsounds);

  const handleIconClick = () => {
    document.getElementById("fileInput").click();
  };

  const resizeAndConvertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      Resizer.imageFileResizer(
        file,
        500,
        500,
        "JPEG",
        70,
        0,
        (base64) => resolve(base64),
        "base64"
      );
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const base64 = await resizeAndConvertToBase64(file);
      setSelectedFile({
        file,
        base64,
        type: file.type,
      });
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  useEffect(() => {
    if (!token) return;

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const role = decodedToken.Role;
    setUserId(decodedToken.userId);

    if (role === "Doctor") {
      setIsDoctor(true);
    }

    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7070/api/Chat/GetUserForChat", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const usersWithLastMessage = await Promise.all(
          response.data.data.$values.map(async (user) => {
            const messageResponse = await axios.get(
              `https://localhost:7070/api/Chat/GetMessages/${user.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const messages = messageResponse.data.$values || [];
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

            if (lastMessage && lastMessage.getFile && lastMessage.getFile.$values.length > 0) {
              lastMessage.messageContent = "Sent a photo";
            }

            return { ...user, lastMessage };
          })
        );

        setUsers(usersWithLastMessage || []);
      } catch (error) {
        console.error("Error fetching users for chat:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleUserClick = async (user) => {
    setSelectedUser(user);

    try {
      const response = await axios.get(
        `https://localhost:7070/api/Chat/GetMessages/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const messages = response.data.$values || [];
      setMessages(messages);
      setIsEmptyConvo(response.data.$values.length === 0);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };


  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const messageDate = new Date(message.sentAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!acc[messageDate]) {
        acc[messageDate] = [];
      }
      acc[messageDate].push(message);
      return acc;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7070/hub', {
        accessTokenFactory: () => token,
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    newConnection.on('ReceiveMessage', (senderId, messageContent, filePath) => {


      const newMessage = {
        senderId,
        messageContent,
        getFile: filePath ? { $values: [{ filePath }] } : null,

        sentAt: new Date().toISOString()
      };


      setMessages(prev => [...prev, newMessage]);

      setUsers(prevUsers => prevUsers.map(user => {
        if (user.id === senderId) {
          return {
            ...user,
            lastMessage: { senderId, messageContent }
          };
        }
        return user;
      }));
    });

    newConnection.start()
      .then(() => setConnection(newConnection))
      .catch(console.error);

    return () => {
      newConnection.stop().catch(console.error);
    };
  }, [token, userId]);

  const sendMessage = async () => {
    if ((!message && !selectedFile) || !selectedUser?.id || !userId || !connection) return;

    const base64Data = selectedFile?.base64 || "";




    try {

      setIsEmptyConvo(false);
      setMessage("");
      setSelectedFile(null);
      setFilePreview(null);

      // Send the message to the server
      await connection.invoke("SendMessage", userId, selectedUser.id.toString(), message, base64Data);
      sendSound.play();

      // Update the last message optimistically
      setUsers(prevUsers => prevUsers.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,

          };
        }
        return user;
      }));
    } catch (err) {
      console.error("Error sending message:", err);

    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };




  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const placeholderImage = "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg";


  return (
    <div className="flex h-[90vh] bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-sky-500 text-white p-4">
        <h2 className="text-2xl font-semibold mb-3">Chats</h2>
        <div className="relative mb-4">
          <Search className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
          />
        </div>
        <div className="space-y-2">
          {users.map((user, index) => (
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
                <p className={`text-sm opacity-90 ${user.lastMessage && user.lastMessage.senderId !== userId ? 'font-bold text-md' : ''}`}>
                  {user.lastMessage ? user.lastMessage.messageContent : "No recent message"}
                </p>
              </div>
            </div>
          ))}
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
          <div className="h-20 border-b flex gap-2 px-6 items-center">
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

          {isEmptyConvo ? (
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
          ) : (
            <div className="flex-1 overflow-auto p-6">
              {Object.keys(groupedMessages).map((date) => (
                <div key={date} className="mb-4">
                  <p className="text-xs font-semibold text-center text-gray-500">{date}</p>
                  <div className="space-y-4">
                    {groupedMessages[date].map((message, index) => (
                      <div key={index} className="flex gap-2">
                        <div className={`flex items-center ${message.senderId === userId ? 'ml-auto' : ''}`}>
                          <div
                            className={`p-3 max-w-xs rounded-lg text-white ${message.senderId === userId
                                ? message.messageContent
                                  ? "bg-sky-500"
                                  : ""
                                : message.senderId !== userId && message.messageContent
                                  ? "bg-cyan-500"
                                  : ""
                              }`}
                          >

                            {message.messageContent && <p>{message.messageContent}</p>}
                            {message.getFile && message.getFile.$values.map((file, idx) => (
                              <>
                                <img
                                  key={idx}
                                  src={file.filePath.startsWith('http') ? file.filePath : `data:image/jpeg;base64,${file.filePath}`}
                                  alt="File"
                                  className="mt-2 rounded-lg cursor-pointer"
                                />

                                <p className="text-xs text-right font-semibold text-sky-800 opacity-60">{new Date(message.sentAt).toLocaleTimeString()}</p>

                              </>

                            ))}
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
          )}

          <div className="flex flex-col gap-4 p-4 bg-white shadow-md border-t">
            {filePreview && (
              <div className="flex gap-2 w-full overflow-x-auto p-2">
                <div className="relative">
                  <img src={filePreview} alt="File preview" className="h-32 w-32 p-2 object-cover rounded-lg" />
                  <button
                    onClick={handleRemoveFile}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <RxCross2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center w-full relative">
              <RiAttachment2
                onClick={handleIconClick}
                className="text-2xl cursor-pointer hover:text-sky-500 transition duration-300 ease-in-out absolute left-3"
              />
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*, .pdf, .doc, .docx"
              />
              <input
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button onClick={sendMessage} className="ml-2 text-blue-600">
                <Send />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;



