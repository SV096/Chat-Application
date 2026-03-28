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
  Image,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupImage, setGroupImage] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

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

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
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
      const { data } = await axios.get(`/api/user?search=${search}`, config);
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
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
          ...(groupImage && { groupImage }),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      setGroupChatName("");
      setSelectedUsers([]);
      setGroupImage("");
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

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
            👥 Create Group Chat
          </ModalHeader>
          <ModalCloseButton 
            color="white" 
            _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
            mt={2}
            mr={2}
          />
          <ModalBody d="flex" flexDir="column" alignItems="center" gap={4} py={6}>
            <FormControl>
              <Input
                placeholder="Group Chat Name"
                mb={0}
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
            </FormControl>
            <FormControl w="100%">
              {groupImage && (
                <Box mb={3} textAlign="center">
                  <Image
                    borderRadius="12px"
                    boxSize="120px"
                    objectFit="cover"
                    src={groupImage}
                    alt="Group"
                    cursor="pointer"
                    onClick={() => document.getElementById("group-pic-input").click()}
                    boxShadow="0 8px 24px rgba(102, 126, 234, 0.2)"
                    transition="all 0.3s ease"
                    _hover={{
                      transform: "scale(1.05)",
                      boxShadow: "0 12px 32px rgba(102, 126, 234, 0.3)"
                    }}
                    mx="auto"
                  />
                </Box>
              )}
              <Button
                w="100%"
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                color="white"
                borderRadius="12px"
                fontWeight="600"
                onClick={() => document.getElementById("group-pic-input").click()}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)"
                }}
                transition="all 0.3s ease"
                isLoading={picLoading}
                spinnerPlacement="start"
              >
                {picLoading ? "Uploading..." : "🖼️ Upload Group Image"}
              </Button>
              <Input
                id="group-pic-input"
                type="file"
                accept="image/jpeg, image/png"
                onChange={(e) => postDetails(e.target.files[0])}
                display="none"
              />
            </FormControl>
            <FormControl w="100%">
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
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
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap" gap={2}>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <Box w="100%" d="flex" justifyContent="center" py={4}>
                <Spinner color="#667eea" size="md" thickness="4px" />
              </Box>
            ) : (
              <Box w="100%">
                {searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))}
              </Box>
            )}
          </ModalBody>
          <ModalFooter gap={3} py={6} borderTopWidth="1px" borderTopColor="#e2e8f0">
            <Button 
              onClick={onClose}
              bg="#f0f0f0"
              color="#4a5568"
              borderRadius="12px"
              fontWeight="600"
              px={6}
              _hover={{ bg: "#e2e8f0" }}
              transition="background 0.3s ease"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              borderRadius="12px"
              fontWeight="600"
              px={8}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)"
              }}
              transition="all 0.3s ease"
            >
              ✅ Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
