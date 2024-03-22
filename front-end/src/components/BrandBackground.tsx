import { Box, Text } from "@chakra-ui/react";
import "./index.css";
import "/brand-intersect.svg";
import { useLocation } from "react-router-dom";
import Logo from "./Logo";

const SignUpText = () => {
  return (
    <Text
      color="white"
      fontSize="7xl"
      fontWeight="semibold"
      mt="20%"
      pl="2em"
      textAlign="left"
      position="relative"
    >
      Welcome <br /> Back!
    </Text>
  );
};

const LoginText = () => {
  return (
    <div
      style={{
        marginTop: "20%",
        textAlign: "left",
        paddingLeft: "7em",
        position: "relative",
      }}
    >
      <Text color="white" fontSize="6xl" fontWeight="semibold">
        Welcome Back,
      </Text>
      <Text color="white" fontSize="xl">
        Login to continue taking your notes
      </Text>
    </div>
  );
};

const WelcomeText = () => {
  let location = useLocation();

  if (location.pathname === "/") return <SignUpText />;
  else if (location.pathname === "/login") return <LoginText />;
};

const BrandBackground = () => {
  return (
    <Box className="container" bgColor="brand.400">
      <div className="semi-circle"></div>
      <object data="brand-intersect.svg" className="intersect" />
      <Logo />
      <WelcomeText />
    </Box>
  );
};

export default BrandBackground;
