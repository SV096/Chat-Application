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
  IconButton,
  Text,
  Image,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import StorageUtil from "../../utils/storageUtil";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pic, setPic] = useState(user.pic);
  const [picLoading, setPicLoading] = useState(false);
  const { user: loggedUser, setUser } = ChatState();
  const toast = useToast();

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
      }, 30000); // 30 second timeout
      
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
            setPic(data.secure_url);
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

  const handleUpdatePic = async () => {
    try {
      setPicLoading(true);
      
      // Get user info from context or localStorage as fallback
      const currentUser = loggedUser || StorageUtil.getJSON("userInfo");
      
      if (!currentUser || !currentUser.token) {
        toast({
          title: "Authentication Error!",
          description: "Your session has expired. Please login again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
        return;
      }

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      };

      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/user/${currentUser._id}`,
        { pic },
        config
      );

      setUser(data);
      StorageUtil.setJSON("userInfo", data);
      toast({
        title: "Profile Picture Updated!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      onClose();
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error!",
        description: error.response?.data?.message || 
                    error.response?.status === 401 ? "Your session expired. Please login again." :
                    "Failed to update picture",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
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
            👤 {user.name}
          </ModalHeader>
          <ModalCloseButton 
            color="white" 
            _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
            mt={2}
            mr={2}
          />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            gap={6}
            py={8}
          >
            <Image
              borderRadius="16px"
              boxSize="180px"
              objectFit="cover"
              src={pic}
              alt={user.name}
              cursor={loggedUser._id === user._id ? "pointer" : "default"}
              onClick={() => loggedUser._id === user._id && document.getElementById("pic-input").click()}
              boxShadow="0 10px 30px rgba(102, 126, 234, 0.2)"
              transition="all 0.3s ease"
              _hover={loggedUser._id === user._id ? {
                transform: "scale(1.05)",
                boxShadow: "0 15px 40px rgba(102, 126, 234, 0.3)"
              } : {}}
            />
            {loggedUser._id === user._id && (
              <>
                <Input
                  id="pic-input"
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={(e) => postDetails(e.target.files[0])}
                  display="none"
                />
                <Button 
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                  size="md"
                  borderRadius="12px"
                  fontWeight="600"
                  onClick={() => document.getElementById("pic-input").click()}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)"
                  }}
                  transition="all 0.3s ease"
                  isLoading={picLoading}
                  spinnerPlacement="start"
                >
                  {picLoading ? "Uploading..." : "📷 Change Photo"}
                </Button>
              </>
            )}
            <Text
              fontSize={{ base: "16px", md: "18px" }}
              fontFamily="Work sans"
              color="#4a5568"
              fontWeight="500"
              textAlign="center"
            >
              ✉️ <strong>Email:</strong> {user.email}
            </Text>
          </ModalBody>
          <ModalFooter gap={3} py={6} borderTopWidth="1px" borderTopColor="#e2e8f0">
            {pic !== user.pic && loggedUser._id === user._id && (
              <Button
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                color="white"
                onClick={handleUpdatePic}
                isLoading={picLoading}
                borderRadius="12px"
                fontWeight="600"
                px={6}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)"
                }}
                transition="all 0.3s ease"
              >
                💾 Save
              </Button>
            )}
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
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
