import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        w="100%"
        p="16px 20px"
        borderWidth="0"
        boxShadow="0 4px 12px rgba(102, 126, 234, 0.3)"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button 
            variant="ghost" 
            onClick={onOpen}
            color="white"
            _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
          >
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4} fontWeight="600">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
          className="app-logo"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="rgba(255, 255, 255, 0.15)"
            p={2}
            borderRadius="10px"
            backdropFilter="blur(5px)"
          >
            <i className="fas fa-comments" style={{ color: "white", fontSize: "24px" }}></i>
          </Box>
          <Text 
            fontSize="lg" 
            fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif" 
            fontWeight="900" 
            color="white" 
            letterSpacing="1.5px"
          >
            CHAT HUB
          </Text>
        </Box>
        <div>
          <Menu>
            <MenuButton p={1} color="white" _hover={{ opacity: 0.8 }}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                  _hover={{ bg: "#f0f0f0" }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton 
              as={Button} 
              bg="rgba(255, 255, 255, 0.2)" 
              rightIcon={<ChevronDownIcon />}
              color="white"
              _hover={{ bg: "rgba(255, 255, 255, 0.3)" }}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
                boxShadow="0 2px 8px rgba(0, 0, 0, 0.15)"
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem _hover={{ bg: "#f0f0f0" }}>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler} _hover={{ bg: "#f0f0f0" }}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent bg="#f8f9fa" borderLeft="none" boxShadow="0 8px 32px rgba(102, 126, 234, 0.2)">
          <DrawerHeader 
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            borderBottomWidth="0"
            fontSize="lg"
            fontWeight="700"
            letterSpacing="0.5px"
            boxShadow="0 4px 12px rgba(102, 126, 234, 0.2)"
          >
            🔍 Search Users
          </DrawerHeader>
          <DrawerBody pt={6}>
            <Box d="flex" pb={4} gap={2}>
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                borderRadius="12px"
                borderWidth="2px"
                borderColor="#e2e8f0"
                _focus={{
                  borderColor: "#667eea",
                  boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                  outline: "none"
                }}
                _placeholder={{ color: "#a0aec0" }}
                height="44px"
                fontSize="14px"
              />
              <Button 
                onClick={handleSearch}
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                color="white"
                borderRadius="12px"
                height="44px"
                px={6}
                fontWeight="600"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)"
                }}
                transition="all 0.3s ease"
              >
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : searchResult?.length > 0 ? (
              <Box>
                {searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))}
              </Box>
            ) : (
              !loading && (
                <Box 
                  textAlign="center" 
                  py={8}
                  color="#a0aec0"
                  fontSize="14px"
                >
                  No users found. Start searching to begin a conversation!
                </Box>
              )
            )}
            {loadingChat && <Box d="flex" justifyContent="center" py={4}><Spinner color="#667eea" size="lg" thickness="4px" /></Box>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
