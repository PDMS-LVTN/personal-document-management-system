import { Outlet } from "react-router-dom";
import {
  Grid,
  GridItem,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import Logo from "../components/Logo";
import { IoIosSearch } from "react-icons/io";
import SideBar from "../components/SideBar";
import { useRef } from "react";
import SearchModal from "../components/SearchModal";
import { InfoGridItem } from "@/components/InfoGridItem";

function HomeLayout() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ref = useRef<any>(null);

  return (
    <Grid
      h="100%"
      templateRows="60px 1fr"
      templateColumns="repeat(10, 1fr)"
      gap="1px"
      bg="#E9E9E9"
    >
      <GridItem
        display={"flex"}
        rowSpan={1}
        colSpan={1}
        bg="white"
        id="logo-grid-item"
      >
        <Logo type="dark" />
      </GridItem>
      <GridItem
        rowSpan={1}
        colSpan={2}
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
          <Text fontWeight="normal" color="text.inactive" fontSize={"15px"}>
            What are you looking for?
          </Text>
          <IoIosSearch size={22} color="var(--brand400)" />
        </Button>
      </GridItem>
      <InfoGridItem />
      <GridItem rowSpan={1} colSpan={1} bg="white" id="sidebar-grid-item">
        <SideBar />
      </GridItem>
      <Outlet context={{ ref }} />
    </Grid>
  );
}

export default HomeLayout;
