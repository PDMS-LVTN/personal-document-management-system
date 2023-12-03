import { Outlet } from "react-router-dom";
import {
  Grid,
  GridItem,
  InputGroup,
  InputRightElement,
  Input,
  Button,
  Text,
  Flex,
} from "@chakra-ui/react";
import Logo from "../components/Logo";
import SearchIcon from "../assets/search-icon.svg";
import SignOutIcon from "../assets/sign-out-icon.svg";
import SideBar from "../components/SideBar";
import { useAuthentication } from "../store/useAuth";
import { useApp } from "../store/useApp";

function HomeLayout() {
  const auth = useAuthentication((state) => state.auth);
  const setAuth = useAuthentication((state) => state.setAuth);

  const currentNote = useApp((state) => state.currentNote);
  const setCurrentNote = useApp((state) => state.setCurrentNote);

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
        justifyContent="space-between"
        pr="2em"
        pl="2em"
        gap="1em"
      >
        <Flex justifyContent="left" alignItems="center" gap="1em">
          <Input
            w="5em"
            variant="unstyled"
            value={currentNote ? currentNote.title : ""}
            onChange={(e) => {
              setCurrentNote({ ...currentNote, title: e.target.value });
            }}
          />
        </Flex>
        <Flex justifyContent="right" alignItems="center" gap="1em">
          <p>{auth.email}</p>
          <Button
            onClick={() => {
              setAuth(undefined);
              setCurrentNote(undefined);
            }}
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
        </Flex>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1} bg="white">
        <SideBar />
      </GridItem>
      <Outlet />
    </Grid>
  );
}

export default HomeLayout;
