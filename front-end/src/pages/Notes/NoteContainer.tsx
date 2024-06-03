import { useEffect, useState } from "react";
import Notes from "./Notes";
import useNotes from "../../hooks/useNotes";
import { useTags } from "../../hooks/useTags";
import { Note, useApp } from "../../store/useApp";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import { IoSearch } from "react-icons/io5";
import PlusIcon from "../../assets/plus-icon.svg";

const NoteSkeleton = () => {
  return (
    <>
      <Flex
        justify="space-between"
        alignItems="center"
        mb="1em"
        pl="2em"
        pr="2em"
        id="notes"
      >
        <Text fontSize="2xl" fontWeight="600">
          Notes
        </Text>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip label="Expand all">
            <Button
              variant="ghost"
              style={{
                height: "40px",
                width: "40px",
                padding: "8px",
                borderRadius: "50%",
              }}
            >
              <ChevronsUpDown color="var(--brand400)" />
            </Button>
          </Tooltip>
          <Tooltip>
            <Button
              variant="ghost"
              mr="0.5em"
              style={{
                height: "40px",
                width: "40px",
                padding: "7px",
                borderRadius: "50%",
              }}
            >
              <SlidersHorizontal color="var(--brand400)" />
            </Button>
          </Tooltip>
          <Menu>
            <MenuButton
              height="32px"
              width="32px"
              padding="10px"
              borderRadius="50%"
              background="var(--brand400)"
            >
              <img src={PlusIcon} alt="create" />
            </MenuButton>
            <MenuList>
              <MenuItem>Create new note</MenuItem>
              <MenuItem>Import file</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Flex>
      <InputGroup pl="2em" pr="2em" w="100%">
        <InputLeftElement pointerEvents="none" ml="2em">
          <IoSearch size="20px" color="var(--brand400)" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search..."
          className="search-input"
          fontSize={"14px"}
          ml={1}
        />
      </InputGroup>
      <Stack px="2em" mt="2em" spacing={5}>
        {Array.from({ length: 5 }, (_, idx) => {
          return (
            <Flex key={idx} alignItems="center" gap={4}>
              <SkeletonCircle size="5" />
              <SkeletonText noOfLines={1} skeletonHeight="2" flex={1} />
            </Flex>
          );
        })}
      </Stack>
    </>
  );
};

function NoteContainer() {
  // const { ref } = useOutletContext<ContextType>();
  const { isLoading, actions } = useNotes();
  const { getAllTags } = useTags();
  const [notes, setNotes] = useState<Note[]>(null);
  const setAllTags = useApp((state) => state.setAllTags);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const loadData = async () => {
      const notesData: Note[] = await actions.getAllNotes(controller);
      const { tags } = await getAllTags(controller);
      if (isMounted) {
        setNotes(notesData);
        setAllTags(tags);
      }
    };
    loadData();

    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  }, []);

  if (!notes) return <NoteSkeleton />;

  return (
    <Notes
      // editorRef={ref}
      notes={notes}
      actions={actions}
      isLoading={isLoading}
    />
  );
}

export default NoteContainer;
