import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
  Image,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import StorageUtil from "../../utils/storageUtil";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const [groupImage, setGroupImage] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_NAME);
      
      // Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setPicLoading(false);
        toast({
          title: "Upload Timeout",
          description: "Upload took too long. Please try again.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }, 30000);
      
      fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
        {
          method: "post",
          body: data,
        }
      )
        .then((res) => {
          clearTimeout(timeoutId);
          return res.json();
        })
        .then((data) => {
          if (data.secure_url) {
            setGroupImage(data.secure_url);
            toast({
              title: "Image Uploaded!",
              status: "success",
              duration: 3000,
              isClosable: true,
              position: "bottom",
            });
          } else if (data.error) {
            throw new Error(data.error.message);
          }
          setPicLoading(false);
        })
        .catch((err) => {
          clearTimeout(timeoutId);
          console.error("Upload error:", err);
          toast({
            title: "Upload Failed!",
            description: err.message || "Failed to upload image",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Invalid Image Format!",
        description: "Please select a JPEG or PNG image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/user?search=${search}`, config);
      console.log(data);
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
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleUpdateGroupImage = async () => {
    if (!groupImage) return;

    // Get user info from context or localStorage as fallback
    const currentUser = user || StorageUtil.getJSON("userInfo");
    
    if (!currentUser || currentUser._id !== selectedChat.groupAdmin._id) {
      toast({
        title: "Only admins can update group image!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setPicLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/chat/groupimage`,
        {
          chatId: selectedChat._id,
          groupImage,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setGroupImage("");
      setPicLoading(false);
      toast({
        title: "Group Image Updated!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.error("Group image update error:", error);
      toast({
        title: "Error!",
        description: error.response?.data?.message || "Failed to update group image",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <IconButton 
        d={{ base: "flex" }} 
        icon={<ViewIcon />} 
        onClick={onOpen}
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        color="white"
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)"
        }}
        transition="all 0.3s ease"
      />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg="white" borderRadius="20px" boxShadow="0 20px 60px rgba(102, 126, 234, 0.25)">
          <ModalHeader
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            fontSize="28px"
            fontFamily="Work sans"
            fontWeight="700"
            d="flex"
            justifyContent="center"
            borderRadius="20px 20px 0 0"
            py={6}
            letterSpacing="0.5px"
          >
            ⚙️ {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton 
            color="white" 
            _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
            mt={2}
            mr={2}
          />
          <ModalBody d="flex" flexDir="column" alignItems="center" gap={4} py={6}>
            <Box textAlign="center">
              <Image
                borderRadius="16px"
                boxSize="140px"
                objectFit="cover"
                src={selectedChat.groupImage}
                alt={selectedChat.chatName}
                boxShadow="0 8px 24px rgba(102, 126, 234, 0.2)"
                cursor={selectedChat.groupAdmin._id === user._id ? "pointer" : "default"}
                onClick={() => selectedChat.groupAdmin._id === user._id && document.getElementById("group-update-pic-input").click()}
                transition="all 0.3s ease"
                _hover={selectedChat.groupAdmin._id === user._id ? {
                  transform: "scale(1.05)",
                  boxShadow: "0 12px 32px rgba(102, 126, 234, 0.3)"
                } : {}}
              />
            </Box>
            {selectedChat.groupAdmin._id === user._id && (
              <FormControl w="100%" d="flex" flexDir="column" alignItems="center" gap={3}>
                {groupImage && (
                  <Box mb={0}>
                    <Image
                      borderRadius="12px"
                      boxSize="110px"
                      objectFit="cover"
                      src={groupImage}
                      alt="New Group"
                      cursor="pointer"
                      onClick={() => document.getElementById("group-update-pic-input").click()}
                      boxShadow="0 6px 18px rgba(102, 126, 234, 0.15)"
                      transition="all 0.3s ease"
                      _hover={{
                        transform: "scale(1.05)",
                        boxShadow: "0 10px 28px rgba(102, 126, 234, 0.25)"
                      }}
                    />
                  </Box>
                )}
                <Button
                  w="100%"
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                  borderRadius="12px"
                  fontWeight="600"
                  onClick={() => document.getElementById("group-update-pic-input").click()}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)"
                  }}
                  transition="all 0.3s ease"
                  isLoading={picLoading}
                  spinnerPlacement="start"
                >
                  {picLoading ? "Uploading..." : "🖼️ Change Group Image"}
                </Button>
                <Input
                  id="group-update-pic-input"
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={(e) => postDetails(e.target.files[0])}
                  display="none"
                />
                {groupImage && (
                  <Button
                    w="100%"
                    bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    color="white"
                    borderRadius="12px"
                    fontWeight="600"
                    onClick={handleUpdateGroupImage}
                    isLoading={picLoading}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)"
                    }}
                    transition="all 0.3s ease"
                  >
                    💾 Save Image
                  </Button>
                )}
              </FormControl>
            )}
            <Box w="100%" d="flex" flexWrap="wrap" gap={2} pb={2}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl w="100%" d="flex" gap={2}>
              <Input
                placeholder="New Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
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
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                color="white"
                borderRadius="12px"
                fontWeight="600"
                px={6}
                isLoading={renameloading}
                onClick={handleRename}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)"
                }}
                transition="all 0.3s ease"
              >
                📝 Update
              </Button>
            </FormControl>
            <FormControl w="100%">
              <Input
                placeholder="Add User to group"
                onChange={(e) => handleSearch(e.target.value)}
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
            </FormControl>

            {loading ? (
              <Box w="100%" d="flex" justifyContent="center" py={4}>
                <Spinner color="#667eea" size="md" thickness="4px" />
              </Box>
            ) : (
              <Box w="100%">
                {searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))}
              </Box>
            )}
          </ModalBody>
          <ModalFooter gap={3} py={6} borderTopWidth="1px" borderTopColor="#e2e8f0">
            <Button 
              onClick={() => handleRemove(user)}
              bg="#ef4444"
              color="white"
              borderRadius="12px"
              fontWeight="600"
              px={6}
              _hover={{
                bg: "#dc2626",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(239, 68, 68, 0.3)"
              }}
              transition="all 0.3s ease"
            >
              🚪 Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
