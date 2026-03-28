import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button, Avatar } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import StorageUtil from "../utils/storageUtil";

const MyChats = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      // Use either context user or localStorage user
      const userInfo = user || loggedUser || StorageUtil.getJSON("userInfo");

      if (!userInfo || !userInfo.token) {
        console.error("No user or token found");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/chat`, config);
      setChats(data);
    } catch (error) {
      console.error("Fetch chats error:", error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    // Fetch chats if user exists in context
    if (user) {
      fetchChats();
    }
    // eslint-disable-next-line
  }, [fetchAgain, userBox
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={4}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="16px"
      borderWidth="0"
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.07)"
    >
      <Box
        pb={4}
        px={4}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        fontWeight="700"
        color="#2d3748"
        letterSpacing="0.5px"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            _hover={{ transform: "translateY(-2px)", boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)" }}
            transition="all 0.3s ease"
            borderRadius="8px"
            fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
            fontWeight="600"
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={4}
        bg="#f7fafc"
        w="100%"
        h="100%"
        borderRadius="12px"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll" spacing={2}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "white"}
                color={selectedChat === chat ? "white" : "black"}
                px={4}
                py={3}
                borderRadius="12px"
                key={chat._id}
                d="flex"
                alignItems="center"
                gap={3}
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateX(4px)",
                  boxShadow: selectedChat === chat ? "0 6px 20px rgba(102, 126, 234, 0.4)" : "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                boxShadow={selectedChat === chat ? "0 4px 15px rgba(102, 126, 234, 0.4)" : "0 2px 4px rgba(0, 0, 0, 0.05)"}
              >
                <Avatar
                  size="md"
                  cursor="pointer"
                  name={
                    !chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName
                  }
                  src={
                    !chat.isGroupChat
                      ? getSenderFull(loggedUser, chat.users)?.pic || ""
                      : chat.groupuser, chat.users)
                      : chat.chatName
                  }
                  src={
                    !chat.isGroupChat
                      ? getSenderFull(u             <Text 
                    fontWeight="700" 
                    fontSize="15px"
                    fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                    letterSpacing="0.4px"
                    color={selectedChat === chat ? "white" : "#1a202c"}
                    mb={1}
                  >
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text 
                      fontSize="13px" 
                      opacity={selectedChat === chat ? 0.85 : 0.65}
                      noOfLines={1}
                      fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                      fontWeight="500"
                      color={selectedChat === chat ? "#e8e8e8" : "#5a6c7d"}
                      lineHeight="1.4"
                    >
                      <span style={{ fontWeight: "700" }}>{chat.latestMessage.sender.name}:</span> {chat.latestMessage.content.length > 45
                        ? chat.latestMessage.content.substring(0, 45) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
