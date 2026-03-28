import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="sm" centerContent minH="100vh" d="flex" flexDir="column" justifyContent="center" bg="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" py={6}>
      <Box
        d="flex"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        p={8}
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        w="100%"
        mb={6}
        borderRadius="24px"
        boxShadow="0 24px 80px rgba(102, 126, 234, 0.4), 0 0 60px rgba(118, 75, 162, 0.2)"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: "-50%",
          right: "-50%",
          width: "200%",
          height: "200%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          animation: "float 20s ease-in-out infinite"
        }}
      >
        <Box 
          fontSize="5xl" 
          mb={4}
          background="rgba(255, 255, 255, 0.2)"
          p={4}
          borderRadius="16px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100px"
          height="100px"
          backdropFilter="blur(20px)"
          border="2px solid rgba(255, 255, 255, 0.3)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
          animation="pulse 3s ease-in-out infinite"
        >
          <i className="fas fa-comments" style={{ color: "white", fontSize: "48px" }}></i>
        </Box>
        <Text 
          fontSize={{ base: "3xl", md: "5xl" }} 
          fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
          fontWeight="900"
          color="white"
          letterSpacing="2px"
          textAlign="center"
          mb={2}
          textShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
        >
          CHAT HUB
        </Text>
        <Text 
          fontSize="md" 
          fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
          fontWeight="600"
          color="rgba(255, 255, 255, 0.95)"
          letterSpacing="2px"
          textAlign="center"
          textShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
        >
          CONNECT. CHAT. COLLABORATE.
        </Text>
      </Box>
      <Box 
        bg="white" 
        w="100%" 
        p={6}
        borderRadius="24px"
        boxShadow="0 16px 60px rgba(102, 126, 234, 0.25), 0 0 40px rgba(102, 126, 234, 0.1)"
        border="1px solid rgba(102, 126, 234, 0.1)"
        backdrop="blur(10px)"
      >
        <Tabs isFitted variant="soft-rounded">
          <TabList mb={6} bg="#f8f9ff" p={1} borderRadius="16px" gap={2}>
            <Tab 
              _selected={{
                bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                boxShadow: "0 6px 20px rgba(102, 126, 234, 0.35)"
              }}
              fontWeight="700"
              fontSize="16px"
              transition="all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
              _hover={{
                transform: "translateY(-3px)",
                bg: "rgba(102, 126, 234, 0.05)"
              }}
              borderRadius="12px"
              py={3}
            >
              🔓 Login
            </Tab>
            <Tab 
              _selected={{
                bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                boxShadow: "0 6px 20px rgba(102, 126, 234, 0.35)"
              }}
              fontWeight="700"
              fontSize="16px"
              transition="all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
              _hover={{
                transform: "translateY(-3px)",
                bg: "rgba(102, 126, 234, 0.05)"
              }}
              borderRadius="12px"
              py={3}
            >
              ✅ Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
