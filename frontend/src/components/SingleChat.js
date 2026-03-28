import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast, Avatar } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import StorageUtil from "../utils/storageUtil";

const ENDPOINT = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      // Get user token from context or localStorage
      const userInfo = user || StorageUtil.getJSON("userInfo");
      
      if (!userInfo || !userInfo.token) {
        console.error("No user or token found for fetching messages");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        // Get user token from context or localStorage
        const userInfo = user || StorageUtil.getJSON("userInfo");
        
        if (!userInfo || !userInfo.token) {
          console.error("No user or token found for sending message");
          return;
        }

        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/message`,
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    // Get user info from context or localStorage
    const userInfo = user || StorageUtil.getJSON("userInfo");
    
    if (userInfo) {
      socket = io(ENDPOINT);
      socket.emit("setup", userInfo);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }

    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            d="flex"
            alignItems="center"
            justifyContent="space-between"
            pb={4}
            px={4}
            w="100%"
            fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
            fontSize={{ base: "28px", md: "30px" }}
            borderBottom="2px solid #e2e8f0"
            bg="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
            borderRadius="16px 16px 0 0"
            fontWeight="700"
            letterSpacing="0.5px"
          >
            <Box d="flex" alignItems="center" gap={3}>
              <IconButton
                d={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
                bg="white"
                _hover={{ bg: "#f0f0f0" }}
              />
              <Avatar
                size="lg"
                cursor="pointer"
                name={
                  !selectedChat.isGroupChat
                    ? getSender(user, selectedChat.users)
                    : selectedChat.chatName
                }
                src={
                  !selectedChat.isGroupChat
                    ? getSenderFull(user, selectedChat.users)?.pic || ""
                    : selectedChat.groupImage || ""
                }
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
              />
              <Box>
                <Text 
                  fontWeight="800" 
                  color="#1a202c"
                  fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                  fontSize="18px"
                  letterSpacing="0.4px"
                  mb={0.5}
                >
                  {!selectedChat.isGroupChat
                    ? getSender(user, selectedChat.users)
                    : selectedChat.chatName.toUpperCase()}
                </Text>
                {selectedChat.isGroupChat && (
                  <Text 
                    fontSize="12px" 
                    color="#5a6c7d"
                    fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                    fontWeight="600"
                    letterSpacing="0.3px"
                  >
                    <span style={{ fontWeight: "700", color: "#667eea" }}>
                      {selectedChat.users.length}
                    </span> members
                  </Text>
                )}
              </Box>
            </Box>
            {messages &&
              (!selectedChat.isGroupChat ? (
                <ProfileModal
                  user={getSenderFull(user, selectedChat.users)}
                />
              ) : (
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              ))}
          </Box>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={4}
            bg="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
            w="100%"
            h="100%"
            borderRadius="0 0 16px 16px"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
                color="#667eea"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={4}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="white"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                borderRadius="24px"
                border="2px solid #e2e8f0"
                fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                fontSize="14px"
                fontWeight="500"
                _focus={{
                  borderColor: "#667eea",
                  boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                }}
                _hover={{
                  bg: "white",
                  borderColor: "#cbd5e0",
                }}
                _placeholder={{
                  color: "#a0aec0",
                  fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                }}
                height="44px"
                px={4}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
