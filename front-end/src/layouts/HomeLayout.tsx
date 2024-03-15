import { Outlet } from "react-router-dom";
import {
  Grid,
  GridItem,
  Input,
  Button,
  Flex,
  Skeleton,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import Logo from "../components/Logo";
import { IoIosSearch } from "react-icons/io";
import SignOutIcon from "../assets/sign-out-icon.svg";
import SideBar from "../components/SideBar";
import { useAuthentication } from "../store/useAuth";
import { useApp } from "../store/useApp";
import { Suspense, useRef } from "react";
import SearchModal from "../components/SearchModal";

function HomeLayout() {
  const auth = useAuthentication((state) => state.auth);
  const setAuth = useAuthentication((state) => state.setAuth);

  const currentNote = useApp((state) => state.currentNote);
  const setCurrentNote = useApp((state) => state.setCurrentNote);
  const clean = useApp((state) => state.clean);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const ref = useRef<any>(null);

  return (
    <Grid
      h="100%"
      templateRows="80px 1fr"
      templateColumns="repeat(10, 1fr)"
      gap="2px"
      bg="#E9E9E9"
    >
      <GridItem rowSpan={1} colSpan={1} bg="white" id="logo-grid-item">
        <Logo type="dark" />
      </GridItem>
      <GridItem
        rowSpan={1}
        colSpan={3}
        bg="#FAF9FE"
        display="flex"
        alignItems="center"
        pl="1em"
        pr="1em"
        id="search-box-grid-item"
      >
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
          <ModalOverlay />
          <ModalContent>
            <ModalBody>
              <SearchModal editorRef={ref} close={onClose} />
            </ModalBody>
          </ModalContent>
        </Modal>
        <Button
          variant="ghost"
          w="100%"
          display="flex"
          justifyContent="space-between"
          onClick={onOpen}
        >
          <Text fontWeight="normal" color="text.inactive">
            What are you looking for?
          </Text>
          <IoIosSearch size={25} color="var(--brand400)" />
        </Button>
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
        id="info-grid-item"
      >
        <Flex justifyContent="left" alignItems="center" gap="1em">
          {currentNote && (
            <Input
              variant="outline"
              value={currentNote ? currentNote.title : ""}
              onChange={(e) => {
                setCurrentNote({ ...currentNote, title: e.target.value });
              }}
            />
          )}
        </Flex>
        <Flex justifyContent="right" alignItems="center" gap="1em">
          <p>{auth.email}</p>
          <Button
            onClick={() => {
              setAuth(undefined);
              clean();
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
      <GridItem rowSpan={1} colSpan={1} bg="white" id="sidebar-grid-item">
        <SideBar />
      </GridItem>
      <Outlet context={{ ref }} />
    </Grid>
  );
}

export default HomeLayout;
