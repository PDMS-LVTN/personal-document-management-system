import { useApp } from "@/store/useApp";
import { useAuthentication } from "@/store/useAuth";
import { Button, Flex, GridItem, Input } from "@chakra-ui/react";
import SignOutIcon from "../assets/sign-out-icon.svg";
import { useLocation } from "react-router-dom";

export const InfoGridItem = () => {
  const currentNote = useApp((state) => state.currentNote);
  const setCurrentNote = useApp((state) => state.setCurrentNote);

  const auth = useAuthentication((state) => state.auth);
  const setAuth = useAuthentication((state) => state.setAuth);

  const clean = useApp((state) => state.clean);
  const location = useLocation();

  return (
    <GridItem
      rowSpan={1}
      colSpan={7}
      bg="white"
      display="flex"
      alignItems="center"
      // justifyContent={currentNote ? "space-between" : "flex-end"}
      pr="2em"
      pl="2em"
      gap="1em"
      id="info-grid-item"
    >
      {currentNote && !location.pathname.includes("shared/table") && (
        <Input
          variant="outline"
          maxWidth="60%"
          value={currentNote ? currentNote.title : ""}
          border={0}
          onChange={(e) => {
            setCurrentNote({ ...currentNote, title: e.target.value });
          }}
          disabled={currentNote.shared}
        />
      )}
      <Flex justifyContent="right" alignItems="center" gap="1em" ml="auto">
        <p>{auth.email}</p>
        <Button
          onClick={() => {
            setAuth(undefined);
            clean();
          }}
          style={{
            height: "40px",
            width: "40px",
            padding: "11px",
            background: "var(--brand400)",
            borderRadius: "50%",
          }}
        >
          <img src={SignOutIcon} alt="sign-out" />
        </Button>
      </Flex>
    </GridItem>
  );
};
