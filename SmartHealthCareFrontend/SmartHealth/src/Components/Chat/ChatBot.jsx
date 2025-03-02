// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Box,
//   Button,
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   Flex,
//   Input,
//   Text,
//   Avatar,
//   IconButton,
//   useColorModeValue,
//   Spinner,
//   VStack,
//   Radio,
//   RadioGroup,
//   Stack,
//   List,
//   ListItem,
//   ListIcon,
//   Badge,
//   useToast
// } from '@chakra-ui/react';
// import { SmallCloseIcon, ChatIcon, ArrowRightIcon, CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
// import { v4 as uuidv4 } from 'uuid';

// // API endpoint URL - update this if your Flask server is running on a different port
// const API_URL = 'http://localhost:5000/api/chat';

// const ChatBot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [sessionId, setSessionId] = useState('');
//   const [optionChoices, setOptionChoices] = useState([]);
//   const [selectedOption, setSelectedOption] = useState('');
//   const [connectionError, setConnectionError] = useState(false);
//   const messagesEndRef = useRef(null);
//   const toast = useToast();

//   const bgColor = useColorModeValue('white', 'gray.800');
//   const userMessageBg = useColorModeValue('purple.500', 'purple.400');
//   const agentMessageBg = useColorModeValue('gray.100', 'gray.700');

//   // Initialize the chat session
//   useEffect(() => {
//     if (isOpen) {
//       // Generate a unique session ID when the component mounts
//       const newSessionId = uuidv4();
//       setSessionId(newSessionId);
//       console.log('New session created:', newSessionId);
      
//       // Send initial request to get the welcome message
//       const fetchInitialMessage = async () => {
//         setLoading(true);
//         setConnectionError(false);
//         try {
//           const response = await fetch(API_URL, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               message: '',
//               session_id: newSessionId
//             }),
//           });
          
//           if (response.ok) {
//             const data = await response.json();
//             console.log('Initial bot response:', data);
//             addBotMessage(data);
//           } else {
//             console.error('API Error:', await response.text());
//             setConnectionError(true);
//             addBotMessage({
//               message: "Sorry, I'm having trouble connecting to the service. Please try again later.",
//               type: "text"
//             });
            
//             toast({
//               title: "Connection Error",
//               description: "Unable to connect to the diagnostic service.",
//               status: "error",
//               duration: 5000,
//               isClosable: true,
//             });
//           }
//         } catch (error) {
//           console.error('Connection Error:', error);
//           setConnectionError(true);
//           addBotMessage({
//             message: "Sorry, I'm having trouble connecting to the service. Please try again later.",
//             type: "text"
//           });
          
//           toast({
//             title: "Connection Error",
//             description: "Make sure the Flask server is running on port 5000.",
//             status: "error",
//             duration: 5000,
//             isClosable: true,
//           });
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchInitialMessage();
//     }
//   }, [isOpen, toast]);

//   const toggleChat = () => {
//     setIsOpen(!isOpen);
//     if (!isOpen) {
//       // Reset everything when opening a closed chat
//       setMessages([]);
//       setSessionId(uuidv4());
//       setConnectionError(false);
//     }
//   };

//   const addUserMessage = (text) => {
//     const newMessage = {
//       id: uuidv4(),
//       text: text,
//       sender: 'user',
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };
//     setMessages((prevMessages) => [...prevMessages, newMessage]);
//   };

//   const addBotMessage = (data) => {
//     let messageContent = data.message;
    
//     // For diagnosis type, format the message nicely
//     if (data.type === 'diagnosis') {
//       messageContent = `${data.disease} Diagnosis:\n\n${data.description}\n\n${data.advice}`;
      
//       if (data.precautions && data.precautions.length > 0) {
//         messageContent += "\n\nRecommended Precautions:";
//         data.precautions.forEach((precaution, index) => {
//           if (precaution) {
//             messageContent += `\n${index + 1}. ${precaution}`;
//           }
//         });
//       }
//     }
    
//     const newMessage = {
//       id: uuidv4(),
//       text: messageContent,
//       sender: 'agent',
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       messageType: data.type,
//       options: data.options || [],
//       severity: data.severity
//     };
    
//     setMessages((prevMessages) => [...prevMessages, newMessage]);
    
//     // If options are provided, store them
//     if (data.type === 'options' && data.options) {
//       setOptionChoices(data.options);
//     } else {
//       setOptionChoices([]);
//       setSelectedOption('');
//     }
//   };

//   const sendMessage = async () => {
//     if (connectionError) {
//       toast({
//         title: "Connection Error",
//         description: "Please check that the Flask server is running and try again.",
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }
    
//     if (!inputMessage.trim() && !selectedOption) return;
    
//     // Determine what message to send
//     let messageToSend = inputMessage.trim();
    
//     // If radio option is selected, use that instead
//     if (selectedOption) {
//       messageToSend = selectedOption;
//     }
    
//     // Clear input and selection
//     addUserMessage(messageToSend);
//     setInputMessage('');
//     setSelectedOption('');
//     setLoading(true);
    
//     // Send message to API
//     try {
//       console.log('Sending message to API:', messageToSend);
//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           message: messageToSend,
//           session_id: sessionId
//         }),
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         console.log('Bot response:', data);
//         addBotMessage(data);
//       } else {
//         console.error('API Error:', await response.text());
//         addBotMessage({
//           message: "Sorry, I'm having trouble processing your request. Please try again.",
//           type: "text"
//         });
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setConnectionError(true);
//       addBotMessage({
//         message: "Sorry, I'm having trouble connecting to the service. Please try again later.",
//         type: "text"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOptionSelect = (value) => {
//     console.log('Option selected:', value);
//     setSelectedOption(value);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       sendMessage();
//     }
//   };

//   // Scroll to the latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Render option selection based on message type
//   const renderMessageContent = (message) => {
//     if (message.sender === 'user') {
//       return <Text fontSize="sm">{message.text}</Text>;
//     }
    
//     if (message.messageType === 'options' && message.options && message.options.length > 0) {
//       return (
//         <VStack align="start" spacing={2} width="100%">
//           <Text fontSize="sm">{message.text}</Text>
//           <RadioGroup onChange={handleOptionSelect} value={selectedOption} width="100%">
//             <Stack spacing={2} width="100%">
//               {message.options.map((option) => (
//                 <Radio key={option.id} value={option.id.toString()} colorScheme="purple">
//                   {option.symptom}
//                 </Radio>
//               ))}
//             </Stack>
//           </RadioGroup>
//         </VStack>
//       );
//     }
    
//     if (message.messageType === 'yesno') {
//       return (
//         <VStack align="start" spacing={2} width="100%">
//           <Text fontSize="sm">{message.text}</Text>
//           <RadioGroup onChange={handleOptionSelect} value={selectedOption}>
//             <Stack direction="row">
//               <Radio value="yes" colorScheme="purple">Yes</Radio>
//               <Radio value="no" colorScheme="purple">No</Radio>
//             </Stack>
//           </RadioGroup>
//         </VStack>
//       );
//     }
    
//     if (message.messageType === 'diagnosis') {
//       const parts = message.text.split('\n\n');
//       return (
//         <VStack align="start" spacing={3} w="100%">
//           <Text fontSize="sm" fontWeight="bold">
//             {parts[0]}
//           </Text>
//           <Text fontSize="sm">{parts[1]}</Text>
//           <Badge colorScheme={message.severity === 1 ? "red" : "yellow"} px={2} py={1} borderRadius="md">
//             {message.severity === 1 ? "Severe" : "Mild to Moderate"}
//           </Badge>
//           <Text fontSize="sm" fontWeight="medium">{parts[2]}</Text>
//           {parts.length > 3 && (
//             <Box w="100%">
//               <Text fontSize="sm" fontWeight="medium" mb={1}>
//                 {parts[3].split(':')[0]}:
//               </Text>
//               <List spacing={1}>
//                 {parts[3].split(':')[1].split('\n').filter(item => item.trim()).map((item, idx) => (
//                   <ListItem key={idx} fontSize="sm">
//                     <ListIcon as={CheckCircleIcon} color="green.500" />
//                     {item.replace(/^\d+\.\s/, '')}
//                   </ListItem>
//                 ))}
//               </List>
//             </Box>
//           )}
//         </VStack>
//       );
//     }
    
//     return <Text fontSize="sm" whiteSpace="pre-line">{message.text}</Text>;
//   };

//   return (
//     <Box position="fixed" bottom="4" right="4" zIndex="50">
//       {isOpen ? (
//         <Card width="400px" boxShadow="xl" bg={bgColor}>
//           {/* Header */}
//           <CardHeader p="3" borderBottom="1px" borderColor="gray.200">
//             <Flex justify="space-between" align="center">
//               <Flex align="center" gap="3">
//                 <Avatar size="md" name="MD" bg="purple.100" color="purple.600" />
//                 <Box>
//                   <Text fontWeight="semibold" color="gray.900">Medical Diagnosis</Text>
//                   <Flex align="center" gap="2">
//                     <Box w="2" h="2" borderRadius="full" bg={connectionError ? "red.500" : "green.500"} />
//                     <Text fontSize="sm" color="gray.500">
//                       {connectionError ? "Disconnected" : "AI Assistant"}
//                     </Text>
//                   </Flex>
//                 </Box>
//               </Flex>
//               <IconButton
//                 variant="ghost"
//                 icon={<SmallCloseIcon />}
//                 onClick={toggleChat}
//                 size="sm"
//                 borderRadius="full"
//                 _hover={{ bg: 'gray.100' }}
//               />
//             </Flex>
//           </CardHeader>

//           {/* Messages Area */}
//           <CardBody height="450px" overflowY="auto" bg="gray.50" p="4">
//             <Flex direction="column" gap="4">
//               {messages.length === 0 && !loading && (
//                 <Flex direction="column" justify="center" align="center" height="100%" opacity="0.5">
//                   <IconButton
//                     icon={<ChatIcon />}
//                     size="lg"
//                     isRound
//                     colorScheme="purple"
//                     variant="ghost"
//                     mb="4"
//                   />
//                   <Text>Your conversation will appear here</Text>
//                 </Flex>
//               )}
              
//               {messages.map((message) => (
//                 <Flex key={message.id} justify={message.sender === 'user' ? 'flex-end' : 'flex-start'} gap="2">
//                   {message.sender === 'agent' && <Avatar size="sm" name="MD" bg="purple.100" color="purple.600" />}
//                   <Flex direction="column" maxW="80%">
//                     <Box
//                       bg={message.sender === 'user' ? userMessageBg : agentMessageBg}
//                       color={message.sender === 'user' ? 'white' : 'gray.800'}
//                       px="4"
//                       py="2"
//                       borderRadius="2xl"
//                       boxShadow="sm"
//                       {...(message.sender === 'user' ? { borderBottomRightRadius: 0, ml: 'auto' } : { borderBottomLeftRadius: 0 })}
//                       width={message.sender === 'agent' ? "100%" : "auto"}
//                     >
//                       {renderMessageContent(message)}
//                     </Box>
//                     <Text fontSize="xs" color="gray.500" mt="1" px="2" alignSelf={message.sender === 'user' ? 'flex-end' : 'flex-start'}>
//                       {message.time}
//                     </Text>
//                   </Flex>
//                   {message.sender === 'user' && <Avatar size="sm" name="ME" bg="gray.100" />}
//                 </Flex>
//               ))}
              
//               {loading && (
//                 <Flex justify="flex-start" align="center" gap="2">
//                   <Avatar size="sm" name="MD" bg="purple.100" color="purple.600" />
//                   <Box
//                     bg={agentMessageBg}
//                     px="4"
//                     py="3"
//                     borderRadius="2xl"
//                     borderBottomLeftRadius={0}
//                   >
//                     <Spinner color="purple.500" size="sm" />
//                   </Box>
//                 </Flex>
//               )}
              
//               <div ref={messagesEndRef} />
//             </Flex>
//           </CardBody>

//           {/* Footer */}
//           <CardFooter p="4" bg={bgColor} borderTop="1px" borderColor="gray.200">
//             {connectionError ? (
//               <Flex width="full" justify="center" align="center" gap="2">
//                 <WarningIcon color="red.500" />
//                 <Text color="red.500" fontSize="sm">Connection error - please try again later</Text>
//                 <Button size="sm" colorScheme="purple" onClick={toggleChat}>
//                   Close
//                 </Button>
//               </Flex>
//             ) : (
//               <Flex width="full" gap="2" align="center">
//                 <Input
//                   placeholder="Type your message..."
//                   flex="1"
//                   borderRadius="full"
//                   bg="gray.100"
//                   border="none"
//                   value={inputMessage}
//                   onChange={(e) => setInputMessage(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   _focus={{ ring: "1px", ringColor: "purple.500" }}
//                   disabled={selectedOption !== '' || loading}
//                 />
//                 <IconButton
//                   icon={<ArrowRightIcon />}
//                   borderRadius="full"
//                   size="sm"
//                   bg="purple.500"
//                   color="white"
//                   _hover={{ bg: 'purple.600' }}
//                   onClick={sendMessage}
//                   isLoading={loading}
//                   isDisabled={(!inputMessage.trim() && !selectedOption) || loading}
//                 />
//               </Flex>
//             )}
//           </CardFooter>
//         </Card>
//       ) : (
//         <IconButton
//           icon={<ChatIcon />}
//           onClick={toggleChat}
//           borderRadius="full"
//           w="14"
//           h="14"
//           bg="purple.500"
//           color="white"
//           _hover={{ bg: 'purple.600' }}
//           boxShadow="lg"
//           transition="transform 0.2s"
//           _active={{ transform: 'scale(0.95)' }}
//         />
//       )}
//     </Box>
//   );
// };

// export default ChatBot;


import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Input,
  Text,
  Avatar,
  IconButton,
  useColorModeValue,
  Spinner,
  VStack,
  Radio,
  RadioGroup,
  Stack,
  List,
  ListItem,
  ListIcon,
  Badge,
  useToast
} from '@chakra-ui/react';
import { SmallCloseIcon, ChatIcon, ArrowRightIcon, CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { v4 as uuidv4 } from 'uuid';

// API endpoint URL - update this if your Flask server is running on a different port
const API_URL = 'http://localhost:5000/api/chat';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [optionChoices, setOptionChoices] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [connectionError, setConnectionError] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const userMessageBg = useColorModeValue('purple.500', 'purple.400');
  const agentMessageBg = useColorModeValue('gray.100', 'gray.700');

  // Initialize the chat session
  useEffect(() => {
    if (isOpen) {
      // Generate a unique session ID when the component mounts
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      console.log('New session created:', newSessionId);
      
      // Send initial request to get the welcome message
      const fetchInitialMessage = async () => {
        setLoading(true);
        setConnectionError(false);
        try {
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: '',
              session_id: newSessionId
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Initial bot response:', data);
            addBotMessage(data);
          } else {
            console.error('API Error:', await response.text());
            setConnectionError(true);
            addBotMessage({
              message: "Sorry, I'm having trouble connecting to the service. Please try again later.",
              type: "text"
            });
            
            toast({
              title: "Connection Error",
              description: "Unable to connect to the diagnostic service.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        } catch (error) {
          console.error('Connection Error:', error);
          setConnectionError(true);
          addBotMessage({
            message: "Sorry, I'm having trouble connecting to the service. Please try again later.",
            type: "text"
          });
          
          toast({
            title: "Connection Error",
            description: "Make sure the Flask server is running on port 5000.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      };

      fetchInitialMessage();
    }
  }, [isOpen, toast]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset everything when opening a closed chat
      setMessages([]);
      setSessionId(uuidv4());
      setConnectionError(false);
    }
  };

  const addUserMessage = (text) => {
    const newMessage = {
      id: uuidv4(),
      text: text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const addBotMessage = (data) => {
    let messageContent = data.message;
    
    // For diagnosis type, format the message nicely
    if (data.type === 'diagnosis') {
      messageContent = `${data.disease} Diagnosis:\n\n${data.description}\n\n${data.advice}`;
      
      if (data.precautions && data.precautions.length > 0) {
        messageContent += "\n\nRecommended Precautions:";
        data.precautions.forEach((precaution, index) => {
          if (precaution) {
            messageContent += `\n${index + 1}. ${precaution}`;
          }
        });
      }
    }
    
    const newMessage = {
      id: uuidv4(),
      text: messageContent,
      sender: 'agent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messageType: data.type,
      options: data.options || [],
      severity: data.severity
    };
    
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    
    // If options are provided, store them
    if (data.type === 'options' && data.options) {
      setOptionChoices(data.options);
    } else {
      setOptionChoices([]);
      setSelectedOption('');
    }
  };

  const sendMessage = async () => {
    if (connectionError) {
      toast({
        title: "Connection Error",
        description: "Please check that the Flask server is running and try again.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (!inputMessage.trim() && !selectedOption) return;
    
    // Determine what message to send
    let messageToSend = inputMessage.trim();
    
    // If radio option is selected, use that instead
    if (selectedOption) {
      messageToSend = selectedOption;
    }
    
    // Clear input and selection
    addUserMessage(messageToSend);
    setInputMessage('');
    setSelectedOption('');
    setLoading(true);
    
    // Send message to API
    try {
      console.log('Sending message to API:', messageToSend);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          session_id: sessionId
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Bot response:', data);
        addBotMessage(data);
      } else {
        console.error('API Error:', await response.text());
        addBotMessage({
          message: "Sorry, I'm having trouble processing your request. Please try again.",
          type: "text"
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setConnectionError(true);
      addBotMessage({
        message: "Sorry, I'm having trouble connecting to the service. Please try again later.",
        type: "text"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (value) => {
    console.log('Option selected:', value);
    setSelectedOption(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Render option selection based on message type
  const renderMessageContent = (message) => {
    if (message.sender === 'user') {
      return <Text fontSize="xs">{message.text}</Text>;
    }
    
    if (message.messageType === 'options' && message.options && message.options.length > 0) {
      return (
        <VStack align="start" spacing={1} width="100%">
          <Text fontSize="xs">{message.text}</Text>
          <RadioGroup onChange={handleOptionSelect} value={selectedOption} width="100%">
            <Stack spacing={1} width="100%">
              {message.options.map((option) => (
                <Radio key={option.id} value={option.id.toString()} colorScheme="purple" size="sm">
                  <Text fontSize="xs">{option.symptom}</Text>
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </VStack>
      );
    }
    
    if (message.messageType === 'yesno') {
      return (
        <VStack align="start" spacing={1} width="100%">
          <Text fontSize="xs">{message.text}</Text>
          <RadioGroup onChange={handleOptionSelect} value={selectedOption}>
            <Stack direction="row">
              <Radio value="yes" colorScheme="purple" size="sm">
                <Text fontSize="xs">Yes</Text>
              </Radio>
              <Radio value="no" colorScheme="purple" size="sm">
                <Text fontSize="xs">No</Text>
              </Radio>
            </Stack>
          </RadioGroup>
        </VStack>
      );
    }
    
    if (message.messageType === 'diagnosis') {
      const parts = message.text.split('\n\n');
      return (
        <VStack align="start" spacing={2} w="100%">
          <Text fontSize="xs" fontWeight="bold">
            {parts[0]}
          </Text>
          <Text fontSize="xs">{parts[1]}</Text>
          <Badge colorScheme={message.severity === 1 ? "red" : "yellow"} px={2} py={0.5} borderRadius="md" fontSize="2xs">
            {message.severity === 1 ? "Severe" : "Mild to Moderate"}
          </Badge>
          <Text fontSize="xs" fontWeight="medium">{parts[2]}</Text>
          {parts.length > 3 && (
            <Box w="100%">
              <Text fontSize="xs" fontWeight="medium" mb={0.5}>
                {parts[3].split(':')[0]}:
              </Text>
              <List spacing={0.5}>
                {parts[3].split(':')[1].split('\n').filter(item => item.trim()).map((item, idx) => (
                  <ListItem key={idx} fontSize="xs">
                    <ListIcon as={CheckCircleIcon} color="green.500" boxSize="3" />
                    {item.replace(/^\d+\.\s/, '')}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </VStack>
      );
    }
    
    return <Text fontSize="xs" whiteSpace="pre-line">{message.text}</Text>;
  };

  return (
    <Box position="fixed" bottom="4" right="4" zIndex="50">
      {isOpen ? (
        <Card width="320px" boxShadow="xl" bg={bgColor} maxH="450px">
          {/* Header */}
          <CardHeader p="2" borderBottom="1px" borderColor="gray.200">
            <Flex justify="space-between" align="center">
              <Flex align="center" gap="2">
                <Avatar size="sm" name="MD" bg="purple.100" color="purple.600" />
                <Box>
                  <Text fontWeight="semibold" fontSize="sm" color="gray.900">Medical Diagnosis</Text>
                  <Flex align="center" gap="1">
                    <Box w="1.5" h="1.5" borderRadius="full" bg={connectionError ? "red.500" : "green.500"} />
                    <Text fontSize="xs" color="gray.500">
                      {connectionError ? "Disconnected" : "AI Assistant"}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
              <IconButton
                variant="ghost"
                icon={<SmallCloseIcon />}
                onClick={toggleChat}
                size="xs"
                borderRadius="full"
                _hover={{ bg: 'gray.100' }}
              />
            </Flex>
          </CardHeader>

          {/* Messages Area */}
          <CardBody 
            height="300px" 
            overflowY="auto" 
            bg="gray.50" 
            p="3"
            css={{
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0,0,0,0.05)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(0,0,0,0.3)',
              },
              'scrollbarWidth': 'thin',
              'scrollbarColor': 'rgba(0,0,0,0.2) rgba(0,0,0,0.05)'
            }}
          >
            <Flex direction="column" gap="3">
              {messages.length === 0 && !loading && (
                <Flex direction="column" justify="center" align="center" height="100%" opacity="0.5">
                  <IconButton
                    icon={<ChatIcon />}
                    size="md"
                    isRound
                    colorScheme="purple"
                    variant="ghost"
                    mb="2"
                  />
                  <Text fontSize="xs">Your conversation will appear here</Text>
                </Flex>
              )}
              
              {messages.map((message) => (
                <Flex key={message.id} justify={message.sender === 'user' ? 'flex-end' : 'flex-start'} gap="1">
                  {message.sender === 'agent' && <Avatar size="2xs" name="MD" bg="purple.100" color="purple.600" />}
                  <Flex direction="column" maxW="80%">
                    <Box
                      bg={message.sender === 'user' ? userMessageBg : agentMessageBg}
                      color={message.sender === 'user' ? 'white' : 'gray.800'}
                      px="3"
                      py="1.5"
                      borderRadius="lg"
                      boxShadow="sm"
                      {...(message.sender === 'user' ? { borderBottomRightRadius: 0, ml: 'auto' } : { borderBottomLeftRadius: 0 })}
                      width={message.sender === 'agent' ? "100%" : "auto"}
                    >
                      {renderMessageContent(message)}
                    </Box>
                    <Text fontSize="2xs" color="gray.500" mt="0.5" px="1" alignSelf={message.sender === 'user' ? 'flex-end' : 'flex-start'}>
                      {message.time}
                    </Text>
                  </Flex>
                  {message.sender === 'user' && <Avatar size="2xs" name="ME" bg="gray.100" />}
                </Flex>
              ))}
              
              {loading && (
                <Flex justify="flex-start" align="center" gap="1">
                  <Avatar size="2xs" name="MD" bg="purple.100" color="purple.600" />
                  <Box
                    bg={agentMessageBg}
                    px="3"
                    py="1.5"
                    borderRadius="lg"
                    borderBottomLeftRadius={0}
                  >
                    <Spinner color="purple.500" size="xs" />
                  </Box>
                </Flex>
              )}
              
              <div ref={messagesEndRef} />
            </Flex>
          </CardBody>

          {/* Footer */}
          <CardFooter p="2" bg={bgColor} borderTop="1px" borderColor="gray.200">
            {connectionError ? (
              <Flex width="full" justify="center" align="center" gap="1" fontSize="xs">
                <WarningIcon color="red.500" boxSize="3" />
                <Text color="red.500">Connection error</Text>
                <Button size="xs" colorScheme="purple" onClick={toggleChat}>
                  Close
                </Button>
              </Flex>
            ) : (
              <Flex width="full" gap="1" align="center">
                <Input
                  placeholder="Type your message..."
                  flex="1"
                  borderRadius="full"
                  bg="gray.100"
                  border="none"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  _focus={{ ring: "1px", ringColor: "purple.500" }}
                  disabled={selectedOption !== '' || loading}
                  size="xs"
                  py="1"
                />
                <IconButton
                  icon={<ArrowRightIcon />}
                  borderRadius="full"
                  size="xs"
                  bg="purple.500"
                  color="white"
                  _hover={{ bg: 'purple.600' }}
                  onClick={sendMessage}
                  isLoading={loading}
                  isDisabled={(!inputMessage.trim() && !selectedOption) || loading}
                />
              </Flex>
            )}
          </CardFooter>
        </Card>
      ) : (
        <IconButton
          icon={<ChatIcon />}
          onClick={toggleChat}
          borderRadius="full"
          w="12"
          h="12"
          bg="purple.500"
          color="white"
          _hover={{ bg: 'purple.600' }}
          boxShadow="lg"
          transition="transform 0.2s"
          _active={{ transform: 'scale(0.95)' }}
        />
      )}
    </Box>
  );
};

export default ChatBot;