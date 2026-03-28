import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, VStack, Heading, Text, Center, Container } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import StorageUtil from "../../utils/storageUtil";

const Login = () => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const { setUser } = ChatState();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/login`,
        { email, password },
        config
      );

      toast({
        title: "Successfully Logged In",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setUser(data);
      StorageUtil.setJSON("userInfo", data);
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Login Failed!",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <Box
      bg="linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={6}
    >
      <Container maxW="480px" centerContent>
        <VStack spacing={8} w="100%">
          {/* Header */}
          <Center>
            <VStack spacing={2} textAlign="center">
              <Box
                w="80px"
                h="80px"
                bg="rgba(255, 255, 255, 0.15)"
                borderRadius="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="48px"
                border="3px solid rgba(255, 255, 255, 0.3)"
              >
                🔐
              </Box>
              <Heading color="white" fontSize="32px" fontWeight="900" letterSpacing="-1px">
                Sign In
              </Heading>
              <Text color="rgba(255, 255, 255, 0.85)" fontSize="15px" fontWeight="500">
                Access your ChatHub account
              </Text>
            </VStack>
          </Center>

          {/* Form Card */}
          <Box
            w="100%"
            bg="rgba(255, 255, 255, 0.95)"
            backdropFilter="blur(10px)"
            borderRadius="20px"
            p={8}
            boxShadow="0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6)"
            border="1px solid rgba(255, 255, 255, 0.2)"
          >
            <VStack spacing={5} w="100%">
              {/* Email Field */}
              <FormControl isRequired>
                <FormLabel
                  fontSize="12px"
                  fontWeight="700"
                  color="#1a202c"
                  mb={2}
                  textTransform="uppercase"
                  letterSpacing="0.5px"
                >
                  Email Address
                </FormLabel>
                <Input
                  value={email}
                  type="email"
                  placeholder="name@company.com"
                  onChange={(e) => setEmail(e.target.value)}
                  borderRadius="12px"
                  borderWidth="2px"
                  borderColor="#e2e8f0"
                  bg="#f7fafc"
                  height="46px"
                  fontSize="15px"
                  fontWeight="500"
                  color="#1a202c"
                  transition="all 0.2s"
                  _focus={{
                    borderColor: "#1976d2",
                    boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.15)",
                    bg: "white",
                  }}
                  _hover={{
                    borderColor: "#cbd5e0",
                  }}
                  _placeholder={{ color: "#a0aec0", fontWeight: "500" }}
                />
              </FormControl>

              {/* Password Field */}
              <FormControl isRequired>
                <FormLabel
                  fontSize="12px"
                  fontWeight="700"
                  color="#1a202c"
                  mb={2}
                  textTransform="uppercase"
                  letterSpacing="0.5px"
                >
                  Password
                </FormLabel>
                <Input
                  value={password}
                  type="password"
                  placeholder="••••••••••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  borderRadius="12px"
                  borderWidth="2px"
                  borderColor="#e2e8f0"
                  bg="#f7fafc"
                  height="46px"
                  fontSize="15px"
                  fontWeight="500"
                  color="#1a202c"
                  transition="all 0.2s"
                  _focus={{
                    borderColor: "#1976d2",
                    boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.15)",
                    bg: "white",
                  }}
                  _hover={{
                    borderColor: "#cbd5e0",
                  }}
                  _placeholder={{ color: "#a0aec0" }}
                />
              </FormControl>

              {/* Sign In Button */}
              <Button
                w="100%"
                bg="linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)"
                color="white"
                height="48px"
                fontSize="16px"
                fontWeight="700"
                borderRadius="12px"
                onClick={submitHandler}
                isLoading={loading}
                mt={3}
                boxShadow="0 10px 25px rgba(25, 118, 210, 0.3)"
                _hover={{
                  transform: "translateY(-3px)",
                  boxShadow: "0 15px 40px rgba(25, 118, 210, 0.4)",
                }}
                _active={{
                  transform: "translateY(-1px)",
                }}
                transition="all 0.2s ease"
              >
                Sign In
              </Button>

              {/* Divider */}
              <Box w="100%" h="1px" bg="#e2e8f0" />

              {/* Demo Button */}
              <Button
                w="100%"
                bg="white"
                color="#1976d2"
                height="48px"
                fontSize="16px"
                fontWeight="700"
                borderRadius="12px"
                border="2px solid #1976d2"
                onClick={() => {
                  setEmail("guest@example.com");
                  setPassword("123456");
                }}
                _hover={{
                  bg: "#f7fafc",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
              >
                Try Demo Account
              </Button>
            </VStack>
          </Box>

          {/* Footer */}
          <Center>
            <Text fontSize="14px" color="rgba(255, 255, 255, 0.9)" textAlign="center">
              Don't have an account?{" "}
              <Box
                as="span"
                color="white"
                fontWeight="700"
                cursor="pointer"
                borderBottom="2px solid white"
                _hover={{ opacity: 0.8 }}
              >
                Create one
              </Box>
            </Text>
          </Center>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;
