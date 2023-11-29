import { Outlet } from "react-router-dom";
import "../index.css";
import {
  Grid,
  GridItem,
  InputGroup,
  InputRightElement,
  Input,
  Button,
} from "@chakra-ui/react";
import Logo from "../components/Logo";
import SearchIcon from "../assets/search-icon.svg";
import SignOutIcon from "../assets/sign-out-icon.svg";
import SideBar from "../components/SideBar";
import useAuth from "../hooks/useAuth";
import { useAuthentication } from "../store/useAuth";

function HomeLayout() {
  const auth = useAuthentication((state) => state.auth);
  const setAuth = useAuthentication((state) => state.setAuth);
  return (
    <Grid
      h="100%"
      templateRows="80px 1fr"
      templateColumns="repeat(10, 1fr)"
      gap="2px"
      bg="#E9E9E9"
    >
      <GridItem rowSpan={1} colSpan={1} bg="white">
        <Logo type="dark" />
      </GridItem>
      <GridItem
        rowSpan={1}
        colSpan={3}
        bg="#FAF9FE"
        display="flex"
        alignItems="center"
        pl="2em"
        pr="2em"
      >
        <InputGroup>
          <Input variant="flushed" placeholder="What are you looking for?" />
          <InputRightElement>
            <img src={SearchIcon} alt="search-icon" />
          </InputRightElement>
        </InputGroup>
      </GridItem>
      <GridItem
        rowSpan={1}
        colSpan={6}
        bg="white"
        display="flex"
        alignItems="center"
        justifyContent="right"
        pr="2em"
        gap="1em"
      >
        <p>{auth.email}</p>
        <Button
          onClick={() => setAuth(undefined)}
          style={{
            height: "50px",
            width: "50px",
            padding: "15px",
            background: "var(--brand400)",
            borderRadius: "50%",
          }}
        >
          <img src={SignOutIcon} alt="sign-out" />
        </Button>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1} bg="white">
        <SideBar />
      </GridItem>
      <Outlet />
    </Grid>
  );
}

export default HomeLayout;
