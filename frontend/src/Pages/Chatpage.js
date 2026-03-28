import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", minHeight: "100vh" }}>
      {user && <SideDrawer />}
      <Box 
        d="flex" 
        justifyContent="space-between" 
        w="100%" 
        h="91.5vh" 
        p="16px"
        gap="16px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
