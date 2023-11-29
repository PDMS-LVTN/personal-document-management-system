import { Box, Text } from "@chakra-ui/react";
import "/brand-icon-white.svg";

const style = {
  light: {
    color: "white",
    size: "xl",
    mt: "20%",
    logoSize: "50px",
    gap: "10px",
  },
  dark: {
    background: "#7540EE",
    color: "black",
    size: "md",
    logoSize: "40px",
    gap: "5px",
  },
};

function Logo({ type = "light" }) {
  return (
    <Box
      style={{ display: "flex", gap: style[type].gap, alignItems: "center" }}
      p="1em"
      pos="relative"
      zIndex="2"
    >
      <Box
        p="2px"
        border="4px solid white"
        borderRadius="16px"
        bg={style[type].background}
      >
        <object
          data="brand-icon-white.svg"
          height={style[type].logoSize}
          width={style[type].logoSize}
        />
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
