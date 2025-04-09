// import React, { useEffect, useState, useRef } from 'react';
// import { MessageCircle, Send, Search } from 'lucide-react';
// import axios from 'axios';
// import Cookies from "js-cookie";
// import * as signalR from '@microsoft/signalr';
// import sendsounds from '../../Assets/Music/SendSound.mp3';
// import { RiAttachment2 } from "react-icons/ri";
// import { RxCross2 } from "react-icons/rx";
// import { FaRegCalendarCheck, FaHandHoldingHeart } from "react-icons/fa";
// import Resizer from 'react-image-file-resizer';

// const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [isDoctor, setIsDoctor] = useState(false);
//   const [connection, setConnection] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [message, setMessage] = useState("");
//   const [isEmptyConvo, setIsEmptyConvo] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);

//   const messagesEndRef = useRef(null);
//   const token = Cookies.get("Token");
//   const sendSound = new Audio(sendsounds);

//   const handleIconClick = () => {
//     document.getElementById("fileInput").click();
//   };

//   const resizeAndConvertToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       Resizer.imageFileResizer(
//         file,
//         500,
//         500,
//         "JPEG",
//         70,
//         0,
//         (base64) => resolve(base64),
//         "base64"
//       );
//     });
//   };

//   const handleFileChange = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const base64 = await resizeAndConvertToBase64(file);
//       setSelectedFile({
//         file,
//         base64,
//         type: file.type,
//       });
//       setFilePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleRemoveFile = () => {
//     setSelectedFile(null);
//     setFilePreview(null);
//   };

//   useEffect(() => {
//     if (!token) return;

//     const decodedToken = JSON.parse(atob(token.split(".")[1]));
//     const role = decodedToken.Role;
//     setUserId(decodedToken.userId);

//     if (role === "Doctor") {
//       setIsDoctor(true);
//     }

//     const fetchData = async () => {
//       try {
//         const response = await axios.get("https://localhost:7070/api/Chat/GetUserForChat", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const usersWithLastMessage = await Promise.all(
//           response.data.data.$values.map(async (user) => {
//             const messageResponse = await axios.get(
//               `https://localhost:7070/api/Chat/GetMessages/${user.id}`,
//               {
//                 headers: { Authorization: `Bearer ${token}` },
//               }
//             );
//             const messages = messageResponse.data.$values || [];
//             const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

//             if (lastMessage && lastMessage.getFile && lastMessage.getFile.$values.length > 0) {
//               lastMessage.messageContent = "Sent a photo";
//             }

//             return { ...user, lastMessage };
//           })
//         );

//         setUsers(usersWithLastMessage || []);
//       } catch (error) {
//         console.error("Error fetching users for chat:", error);
//       }
//     };

//     fetchData();
//   }, [token]);

//   const handleUserClick = async (user) => {
//     setSelectedUser(user);

//     try {
//       const response = await axios.get(
//         `https://localhost:7070/api/Chat/GetMessages/${user.id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const messages = response.data.$values || [];
//       setMessages(messages);
//       setIsEmptyConvo(response.data.$values.length === 0);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };


//   const groupMessagesByDate = (messages) => {
//     return messages.reduce((acc, message) => {
//       const messageDate = new Date(message.sentAt).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });
//       if (!acc[messageDate]) {
//         acc[messageDate] = [];
//       }
//       acc[messageDate].push(message);
//       return acc;
//     }, {});
//   };

//   const groupedMessages = groupMessagesByDate(messages);

//   useEffect(() => {
//     const newConnection = new signalR.HubConnectionBuilder()
//       .withUrl('https://localhost:7070/hub', {
//         accessTokenFactory: () => token,
//         withCredentials: true,
//       })
//       .withAutomaticReconnect()
//       .build();

//     newConnection.on('ReceiveMessage', (senderId, messageContent, filePath) => {


//       const newMessage = {
//         senderId,
//         messageContent,
//         getFile: filePath ? { $values: [{ filePath }] } : null,

//         sentAt: new Date().toISOString()
//       };


//       setMessages(prev => [...prev, newMessage]);

//       setUsers(prevUsers => prevUsers.map(user => {
//         if (user.id === senderId) {
//           return {
//             ...user,
//             lastMessage: { senderId, messageContent }
//           };
//         }
//         return user;
//       }));
//     });

//     newConnection.start()
//       .then(() => setConnection(newConnection))
//       .catch(console.error);

//     return () => {
//       newConnection.stop().catch(console.error);
//     };
//   }, [token, userId]);

//   const sendMessage = async () => {
//     if ((!message && !selectedFile) || !selectedUser?.id || !userId || !connection) return;

//     const base64Data = selectedFile?.base64 || "";




//     try {

//       setIsEmptyConvo(false);
//       setMessage("");
//       setSelectedFile(null);
//       setFilePreview(null);

//       // Send the message to the server
//       await connection.invoke("SendMessage", userId, selectedUser.id.toString(), message, base64Data);
//       sendSound.play();

//       // Update the last message optimistically
//       setUsers(prevUsers => prevUsers.map(user => {
//         if (user.id === selectedUser.id) {
//           return {
//             ...user,

//           };
//         }
//         return user;
//       }));
//     } catch (err) {
//       console.error("Error sending message:", err);

//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       sendMessage();
//     }
//   };




//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const placeholderImage = "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg";


//   return (
//     <div className="flex h-[90vh] bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-64 bg-sky-500 text-white p-4">
//         <h2 className="text-2xl font-semibold mb-3">Chats</h2>
//         <div className="relative mb-4">
//           <Search className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search"
//             className="w-full pl-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
//           />
//         </div>
//         <div className="space-y-2">
//           {users.map((user, index) => (
//             <div
//               key={index}
//               className="flex items-center space-x-2 p-2 hover:bg-sky-300 rounded-lg cursor-pointer"
//               onClick={() => handleUserClick(user)}
//             >
//               <div className="w-12 h-12 rounded-full bg-sky-200 overflow-hidden">
//                 <img
//                   src={user.profile || placeholderImage}
//                   alt="User profile"
//                   className="w-12 h-12 object-cover"
//                 />
//               </div>
//               <div className="flex-1">
//                 {isDoctor ? (
//                   <p className="text-lg font-medium">{user.name}</p>
//                 ) : (
//                   <p className="text-lg font-medium">Dr. {user.name}</p>
//                 )}
//                 <p className={`text-sm opacity-90 ${user.lastMessage && user.lastMessage.senderId !== userId ? 'font-bold text-md' : ''}`}>
//                   {user.lastMessage ? user.lastMessage.messageContent : "No recent message"}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       {!selectedUser ? (
//         <div className="flex-1 flex flex-col justify-center items-center space-y-6 p-8 bg-gradient-to-b from-blue-50 to-white">
//           <div className="flex flex-col items-center space-y-4">
//             <div className="bg-blue-100 p-4 rounded-full">
//               <MessageCircle className="w-12 h-12 text-blue-600" />
//             </div>
//             <h2 className="text-3xl font-bold text-gray-800">Welcome to SmartHealth Chat</h2>
//             <p className="text-lg text-gray-600 text-center">Start your healthcare journey with instant medical consultations</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
//             <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <h3 className="font-semibold text-gray-800">Easy Scheduling</h3> <FaRegCalendarCheck />
//                 </div>
//                 <p className="text-sm text-gray-600">Book appointments with just a few clicks</p>
//               </div>
//             </div>
//             <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <h3 className="font-semibold text-gray-800">Expert Care</h3> <FaHandHoldingHeart />
//                 </div>
//                 <p className="text-sm text-gray-600">Connect with qualified healthcare professionals</p>
//               </div>
//             </div>
//           </div>
//           <p className="text-sm text-gray-500 mt-6">Select a chat to begin your consultation</p>
//         </div>
//       ) : (
//         <div className="flex-1 flex flex-col">
//           <div className="h-20 border-b flex gap-2 px-6 items-center">
//             <div className="w-12 h-12 rounded-full bg-sky-200 overflow-hidden">
//               <img
//                 src={selectedUser.profile || placeholderImage}
//                 alt="User profile"
//                 className="w-12 h-12 object-cover"
//               />
//             </div>
//             {isDoctor ? (
//               <p className="text-xl font-medium">{selectedUser.name}</p>
//             ) : (
//               <p className="text-xl font-medium">Dr. {selectedUser.name}</p>
//             )}
//           </div>

//           {isEmptyConvo ? (
//             <div className="flex-1 flex flex-col justify-center items-center space-y-6 p-8 bg-gradient-to-b from-blue-50 to-white">
//               <div className="flex flex-col items-center space-y-4">
//                 <div className="bg-blue-100 p-4 rounded-full">
//                   <MessageCircle className="w-12 h-12 text-blue-600" />
//                 </div>
//                 <h2 className="text-3xl font-bold text-gray-800">Let's Get Chatting!</h2>
//                 <p className="text-lg text-gray-600 text-center">Your next great conversation starts here. Connect, share, and explore!</p>
//               </div>
//               <p className="text-sm text-gray-500 mt-6">Smart Health is here to simplify your life. Start your journey towards better living today!</p>
//             </div>
//           ) : (
//             <div className="flex-1 overflow-auto p-6">
//               {Object.keys(groupedMessages).map((date) => (
//                 <div key={date} className="mb-4">
//                   <p className="text-xs font-semibold text-center text-gray-500">{date}</p>
//                   <div className="space-y-4">
//                     {groupedMessages[date].map((message, index) => (
//                       <div key={index} className="flex gap-2">
//                         <div className={`flex items-center ${message.senderId === userId ? 'ml-auto' : ''}`}>
//                           <div
//                             className={`p-3 max-w-xs rounded-lg text-white ${message.senderId === userId
//                                 ? message.messageContent
//                                   ? "bg-sky-500"
//                                   : ""
//                                 : message.senderId !== userId && message.messageContent
//                                   ? "bg-cyan-500"
//                                   : ""
//                               }`}
//                           >

//                             {message.messageContent && <p>{message.messageContent}</p>}
//                             {message.getFile && message.getFile.$values.map((file, idx) => (
//                               <>
//                                 <img
//                                   key={idx}
//                                   src={file.filePath.startsWith('http') ? file.filePath : `data:image/jpeg;base64,${file.filePath}`}
//                                   alt="File"
//                                   className="mt-2 rounded-lg cursor-pointer"
//                                 />

//                                 <p className="text-xs text-right font-semibold text-sky-800 opacity-60">{new Date(message.sentAt).toLocaleTimeString()}</p>

//                               </>

//                             ))}
//                             <p className="text-xs text-right opacity-60">{new Date(message.sentAt).toLocaleTimeString()}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//           )}

//           <div className="flex flex-col gap-4 p-4 bg-white shadow-md border-t">
//             {filePreview && (
//               <div className="flex gap-2 w-full overflow-x-auto p-2">
//                 <div className="relative">
//                   <img src={filePreview} alt="File preview" className="h-32 w-32 p-2 object-cover rounded-lg" />
//                   <button
//                     onClick={handleRemoveFile}
//                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                   >
//                     <RxCross2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             )}

//             <div className="flex items-center w-full relative">
//               <RiAttachment2
//                 onClick={handleIconClick}
//                 className="text-2xl cursor-pointer hover:text-sky-500 transition duration-300 ease-in-out absolute left-3"
//               />
//               <input
//                 type="file"
//                 id="fileInput"
//                 style={{ display: "none" }}
//                 onChange={handleFileChange}
//                 accept="image/*, .pdf, .doc, .docx"
//               />
//               <input
//                 type="text"
//                 placeholder="Type a message"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 className="w-full pl-12 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-300"
//               />
//               <button onClick={sendMessage} className="ml-2 text-blue-600">
//                 <Send />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chat;



import React, { useEffect, useState, useRef } from 'react';
import { MessageCircle, Send, Search, Video, Phone, Calendar, ChevronLeft, MoreHorizontal, Image as ImageIcon, FileText, Smile } from 'lucide-react';
import axios from 'axios';
import Cookies from "js-cookie";
import * as signalR from '@microsoft/signalr';
import sendsounds from '../../Assets/Music/SendSound.mp3';
import { RiAttachment2 } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { FaRegCalendarCheck, FaHandHoldingHeart, FaUserMd, FaRegHospital } from "react-icons/fa";
import Resizer from 'react-image-file-resizer';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  // const [isTyping, setIsTyping] = useState(false);

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
      const isPhotoMessage = filePath ? true : false;
      const displayContent = isPhotoMessage ? "Sent a photo" : messageContent;

      const newMessage = {
        senderId,
        messageContent,
        getFile: filePath ? { $values: [{ filePath }] } : null,

        sentAt: new Date().toISOString()
      };


      setMessages(prev => [...prev, newMessage]);

      setUsers(prevUsers => prevUsers.map(user => {
        if (user.id === senderId || (selectedUser && user.id === selectedUser.id)) {
          return {
            ...user,
            lastMessage: { 
              senderId, 
              messageContent: displayContent,
              getFile: filePath ? { $values: [{ filePath }] } : null
            }
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
  }, [token, userId, selectedUser]);

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

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Time formatting
  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const messageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const emptyStateVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  const userItemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { backgroundColor: 'rgba(14, 165, 233, 0.15)' }
  };

  const getProfileInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex h-[90vh] bg-slate-50">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-80 md:w-96 bg-white border-r border-gray-200 shadow-lg"
          >
            <div className="p-6 bg-gradient-to-r from-sky-500 to-cyan-600">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                <MessageCircle className="w-6 h-6 mr-2" /> SmartHealth Chat
              </h2>
              <p className="text-sky-100 text-sm">Connect with your healthcare providers</p>
            </div>
            
            <div className="relative p-4">
              <Search className="absolute top-6 left-7 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50"
              />
            </div>
            
            <div className="p-2 overflow-y-auto max-h-[calc(90vh-160px)]">
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    variants={userItemVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: index * 0.05 }}
                    whileHover="hover"
                    className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer mb-2 ${
                      selectedUser?.id === user.id ? 'bg-sky-100 shadow' : ''
                    }`}
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-cyan-300 flex items-center justify-center text-white font-bold text-lg shadow">
                        {user.profile ? (
                          <img
                            src={user.profile}
                            alt={user.name}
                            className="w-18 h-18 object-cover rounded-full"
                          />
                        ) : (
                          getProfileInitials(user.name)
                        )}
                      </div>
                      {user.isOnline && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-800">
                          {isDoctor ? user.name : `Dr. ${user.name}`}
                        </p>
                        <span className="text-xs text-gray-500">{user.lastSeen}</span>
                      </div>
                      <p className={`text-sm ${
                        user.lastMessage && user.lastMessage.senderId !== userId 
                          ? 'font-medium text-gray-800' 
                          : 'text-gray-500'
                      } truncate max-w-[180px]`}>
                        {user.lastMessage 
                          ? user.lastMessage.messageContent 
                          : "Start a conversation"}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredUsers.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <Search className="mx-auto w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">No conversations found</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
  
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedUser ? (
          <motion.div 
            variants={emptyStateVariants}
            initial="initial"
            animate="animate"
            className="flex-1 flex flex-col justify-center items-center space-y-8 p-8 bg-gradient-to-b from-blue-50 to-white"
          >
            <div className="max-w-lg text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-24 h-24 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full mx-auto flex items-center justify-center mb-6"
              >
                <MessageCircle className="w-12 h-12 text-white" />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-gray-800 mb-4"
              >
                Welcome to SmartHealth Messaging
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-gray-600 mb-8"
              >
                Connect with your healthcare providers for seamless consultations, appointment scheduling, and medical advice.
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl"
            >
              <motion.div 
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex items-start space-x-4"
              >
                <div className="rounded-full bg-blue-100 p-3">
                  <FaUserMd className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">Expert Consultations</h3>
                  <p className="text-gray-600">Connect with qualified specialists for personalized healthcare guidance.</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex items-start space-x-4"
              >
                <div className="rounded-full bg-green-100 p-3">
                  <FaRegCalendarCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">Easy Scheduling</h3>
                  <p className="text-gray-600">Book and manage your appointments with just a few taps.</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex items-start space-x-4"
              >
                <div className="rounded-full bg-purple-100 p-3">
                  <FaHandHoldingHeart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">Personalized Care</h3>
                  <p className="text-gray-600">Receive healthcare advice tailored to your specific needs.</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex items-start space-x-4"
              >
                <div className="rounded-full bg-amber-100 p-3">
                  <FaRegHospital className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">Virtual Hospital</h3>
                  <p className="text-gray-600">Access medical expertise from the comfort of your home.</p>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-gray-500 mt-8"
            >
              Select a conversation from the sidebar to begin chatting with your healthcare provider
            </motion.p>
          </motion.div>
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-20 bg-white border-b border-gray-200 shadow-sm flex items-center px-6 justify-between"
            >
              <div className="flex items-center gap-4">
                {/* Back button to show sidebar - always visible now */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSidebar(true)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </motion.button>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-cyan-300 flex items-center justify-center text-white font-bold shadow">
                      {selectedUser.profile ? (
                        <img
                          src={selectedUser.profile}
                          alt={selectedUser.name}
                          className="w-18 h-18 object-cover rounded-full"
                        />
                      ) : (
                        getProfileInitials(selectedUser.name)
                      )}
                    </div>
                    {selectedUser.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {isDoctor ? selectedUser.name : `Dr. ${selectedUser.name}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedUser.isOnline ? 'Online' : selectedUser.lastSeen}
                    </p>
                  </div>
                </div>
              </div>
              
          
              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <Calendar className="w-5 h-5 text-gray-700" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-700" />
                </motion.button>
              </div>
            </motion.div>
  
            {isEmptyConvo ? (
              <motion.div 
                variants={emptyStateVariants}
                initial="initial"
                animate="animate"
                className="flex-1 flex flex-col justify-center items-center p-8 bg-white"
              >
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <MessageCircle className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Start a Conversation</h3>
                <p className="text-center text-gray-600 max-w-md mb-6">
                  This is the beginning of your conversation with {isDoctor ? selectedUser.name : `Dr. ${selectedUser.name}`}. Send a message to get started.
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.querySelector('input[type="text"]').focus()}
                  className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl"
                >
                  Send your first message
                </motion.button>
              </motion.div>
            ) : (
              <div className="flex-1 overflow-auto p-6 bg-gray-50">
                {Object.keys(groupedMessages).map((date) => (
                  <div key={date} className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-gray-200 rounded-full px-4 py-1">
                        <p className="text-xs font-medium text-gray-700">{date}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <AnimatePresence>
                        {groupedMessages[date].map((msg, index) => (
                          <motion.div
                            key={index}
                            variants={messageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs md:max-w-md ${msg.senderId === userId ? 'order-2' : 'order-1'}`}>
                              {msg.senderId !== userId && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br  from-sky-400 to-cyan-300 flex items-center justify-center text-white text-xs font-bold mb-1 ml-1">
                                  {selectedUser.profile ? (
                                    <img
                                      src={selectedUser.profile}
                                      alt={selectedUser.name}
                                      className="w-18 h-18 object-cover rounded-full"
                                    />
                                  ) : (
                                    getProfileInitials(selectedUser.name)
                                  )}
                                </div>
                              )}
                              
                              <div className={`rounded-2xl p-4 shadow-sm ${
                                msg.senderId === userId 
                                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-tr-none' 
                                  : 'bg-white text-gray-800 rounded-tl-none'
                              }`}>
                                {msg.messageContent && <p className="text-base mb-1">{msg.messageContent}</p>}
                                
                                {msg.getFile && msg.getFile.$values && msg.getFile.$values.map((file, idx) => {
  // Determine the correct image source
  let imageSource;
  
  // If this file has a local preview URL (freshly sent by current user)
  if (file.localPreviewUrl) {
    imageSource = file.localPreviewUrl;
  }
  // If this is a server URL
  else if (file.filePath && file.filePath.startsWith('http')) {
    imageSource = file.filePath;
  }
  // Otherwise, assume it's base64 data
  else {
    imageSource = `data:image/jpeg;base64,${file.filePath}`;
  }
  
  return (
    <motion.div
      key={idx}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-2"
    >
      <img
        src={imageSource}
        alt="File"
        className="rounded-lg w-full object-cover shadow-sm"
      />
    </motion.div>
  );
})}                             <p className={`text-xs mt-1 ${
                                  msg.senderId === userId ? 'text-blue-100' : 'text-gray-500'
                                } text-right`}>
                                  {formatTime(msg.sentAt)}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
                
                <div ref={messagesEndRef} />
              </div>
            )}
  
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-t border-gray-200 p-4"
            >
              {filePreview && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2 w-full overflow-x-auto p-2"
                >
                  <div className="relative">
                    <img src={filePreview} alt="File preview" className="h-32 w-32 p-2 object-cover rounded-lg" />
                    <button
                      onClick={handleRemoveFile}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <RxCross2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
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
                <button 
                  onClick={sendMessage} 
                  className="ml-2 bg-gradient-to-r from-sky-500 to-blue-600 p-3 rounded-full shadow hover:shadow-md transition-all"
                >
                  <Send className="text-white" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;