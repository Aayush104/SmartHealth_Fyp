import React, { useState } from 'react';
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
  useColorModeValue
} from '@chakra-ui/react';
import { SmallCloseIcon, ChatIcon, ArrowRightIcon } from '@chakra-ui/icons';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! How can I help you today?", sender: "agent", time: "10:00 AM" },
    { id: 2, text: "I have a question about my recent order", sender: "user", time: "10:01 AM" },
    { id: 3, text: "Of course! I'd be happy to help. Could you please provide your order number?", sender: "agent", time: "10:01 AM" }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const bgColor = useColorModeValue('white', 'gray.800');
  const userMessageBg = useColorModeValue('purple.500', 'purple.400');
  const agentMessageBg = useColorModeValue('gray.100', 'gray.700');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  return (
    <Box position="fixed" bottom="4" right="4" zIndex="50">
      {isOpen ? (
        <Card width="384px" boxShadow="xl" bg={bgColor}>
          {/* Header */}
          <CardHeader p="3" borderBottom="1px" borderColor="gray.200">
            <Flex justify="space-between" align="center">
              <Flex align="center" gap="3">
                <Avatar size="md" name="CS" bg="purple.100" color="purple.600" />
                <Box>
                  <Text fontWeight="semibold" color="gray.900">Customer Support</Text>
                  <Flex align="center" gap="2">
                    <Box w="2" h="2" borderRadius="full" bg="green.500" />
                    <Text fontSize="sm" color="gray.500">Online</Text>
                  </Flex>
                </Box>
              </Flex>
              <IconButton
                variant="ghost"
                icon={<SmallCloseIcon />}
                onClick={toggleChat}
                size="sm"
                borderRadius="full"
                _hover={{ bg: 'gray.100' }}
              />
            </Flex>
          </CardHeader>

          {/* Messages Area */}
          <CardBody height="384px" overflowY="auto" bg="gray.50" p="4">
            <Flex direction="column" gap="4">
              {messages.map((message) => (
                <Flex key={message.id} justify={message.sender === 'user' ? 'flex-end' : 'flex-start'} gap="2">
                  {message.sender === 'agent' && <Avatar size="sm" name="CS" bg="purple.100" color="purple.600" />}
                  <Flex direction="column">
                    <Box
                      maxW="80%"
                      bg={message.sender === 'user' ? userMessageBg : agentMessageBg}
                      color={message.sender === 'user' ? 'white' : 'gray.800'}
                      px="4"
                      py="2"
                      borderRadius="2xl"
                      {...(message.sender === 'user' ? { borderBottomRightRadius: 0, ml: 'auto' } : { borderBottomLeftRadius: 0 })}
                    >
                      <Text fontSize="sm">{message.text}</Text>
                    </Box>
                    <Text fontSize="xs" color="gray.500" mt="1" px="2">{message.time}</Text>
                  </Flex>
                  {message.sender === 'user' && <Avatar size="sm" name="ME" bg="gray.100" />}
                </Flex>
              ))}
            </Flex>
          </CardBody>

          {/* Footer */}
          <CardFooter p="4" bg={bgColor} borderTop="1px" borderColor="gray.200">
            <Flex width="full" gap="2" align="center">
              <Input
                placeholder="Type your message..."
                flex="1"
                borderRadius="full"
                bg="gray.100"
                border="none"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                _focus={{ ring: "1px", ringColor: "purple.500" }}
              />
              <IconButton
                icon={<ArrowRightIcon />}
                borderRadius="full"
                size="sm"
                bg="purple.500"
                color="white"
                _hover={{ bg: 'purple.600' }}
                onClick={sendMessage}
              />
            </Flex>
          </CardFooter>
        </Card>
      ) : (
        <IconButton
          icon={<ChatIcon />}
          onClick={toggleChat}
          borderRadius="full"
          w="14"
          h="14"
          bg="purple.500"
          color="white"
          _hover={{ bg: 'purple.600' }}
          boxShadow="lg"
          transition="transform 0.2s"
         
        />
      )}
    </Box>
  );
};

export default ChatBot;
