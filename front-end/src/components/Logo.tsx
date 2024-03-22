import { Box, Text } from "@chakra-ui/react";
import "/brand-icon-white.svg";

const style = {
  light: {
    color: "white",
    size: "lg",
    mt: "20%",
    logoSize: "30px",
    gap: "10px",
  },
  dark: {
    background: "#7540EE",
    color: "black",
    size: "14px",
    logoSize: "25px",
    gap: "5px",
  },
};

function Logo({ type = "light" }) {
  return (
    <Box
      style={{ display: "flex", gap: style[type].gap, alignItems: "center", justifyContent: "start" }}
      p="1em"
      pos="relative"
    >
      <Box
        p="4px"
        border="3px solid white"
        borderRadius="10px"
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
        fontWeight="800"
      >
        SELFNOTE
      </Text>
    </Box>
  );
}

export default Logo;
