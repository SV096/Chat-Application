import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      px={3}
      py={2}
      borderRadius="12px"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      bg={admin === user._id ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}
      color="white"
      fontWeight="600"
      cursor="pointer"
      onClick={handleFunction}
      boxShadow="0 4px 8px rgba(102, 126, 234, 0.2)"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "0 6px 16px rgba(102, 126, 234, 0.3)",
      }}
      display="flex"
      alignItems="center"
      gap={2}
    >
      <span>{user.name}</span>
      {admin === user._id && <span>👑</span>}
      <CloseIcon boxSize={3} ml={1} opacity="0.7" _hover={{ opacity: 1 }} />
    </Badge>
  );
};

export default UserBadgeItem;
