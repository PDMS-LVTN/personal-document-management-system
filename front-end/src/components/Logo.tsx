import { Box, Text } from "@chakra-ui/react";
import "/brand-icon-white.svg";

const style = {
  light: {
    color: "white",
    size: "xl",
    mt: "20%",
  },
  dark: {
    background: "#7540EE",
    color: "black",
  },
};

function Logo({ type = "light" }) {
  return (
    <Box
      style={{ display: "flex", gap: "10px", alignItems: "center" }}
      p="1em"
      pos="relative"
      zIndex="2"
    >
      <Box p="2px" border="4px solid white" borderRadius="16px">
        <object data="brand-icon-white.svg" height="50px" width="50px" />
      </Box>
      <Text
        fontSize={style[type]?.size}
        color={style[type]?.color}
        fontWeight="semibold"
      >
        SELF-NOTE
      </Text>
    </Box>
  );
}

export default Logo;
