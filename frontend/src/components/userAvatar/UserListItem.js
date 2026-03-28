import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="white"
      border="2px solid #e2e8f0"
      _hover={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        borderColor: "transparent",
        transform: "translateX(4px)",
        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.2)",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="#2d3748"
      px={4}
      py={3}
      mb={2}
      borderRadius="12px"
      transition="all 0.3s ease"
      boxShadow="0 2px 4px rgba(0, 0, 0, 0.05)"
    >
      <Avatar
        mr={3}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
        boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
      />
      <Box flex={1}>
        <Text fontWeight="600" fontSize="14px">
          {user.name}
        </Text>
        <Text fontSize="xs" opacity={0.7}>
          <strong>📧 </strong> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
