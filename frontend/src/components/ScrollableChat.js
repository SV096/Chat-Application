import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", marginBottom: "8px" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={2}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                  boxShadow="0 2px 8px rgba(0, 0, 0, 0.15)"
                />
              </Tooltip>
            )}
            <span
              style={{
                background: m.sender._id === user._id 
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "#ffffff",
                color: m.sender._id === user._id ? "#ffffff" : "#1a202c",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: m.sender._id === user._id ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                padding: "12px 16px",
                maxWidth: "75%",
                wordWrap: "break-word",
                boxShadow: m.sender._id === user._id 
                  ? "0 4px 12px rgba(102, 126, 234, 0.35)"
                  : "0 4px 12px rgba(0, 0, 0, 0.08)",
                fontSize: "14px",
                lineHeight: "1.5",
                fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: "500",
                letterSpacing: "0.3px",
                border: m.sender._id === user._id ? "none" : "1.5px solid #d4dce6",
                display: "inline-block",
                transition: "all 0.2s ease",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
