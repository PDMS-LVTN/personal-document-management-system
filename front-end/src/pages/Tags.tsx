import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useTags } from "../hooks/useTags";
import { FaPlus } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useApp } from "../store/useApp";
import { useCallback, useEffect, useState } from "react";
import { IoMdPricetag } from "react-icons/io";
import useNotes from "../hooks/useNotes";
import { useLocation, useOutletContext } from "react-router";
import { ContextType } from "../layouts/TreeAndEditorContainer";
import { debounce } from "lodash";

// BUG: tags are duplicated
export const Tags = () => {
  const { createTag } = useTags();
  const allTags = useApp((state) => state.allTags);
  const { getAllTags, getNotesInTag } = useTags();
  const [tagName, setTagName] = useState("");
  const [mode, setMode] = useState("tags");
  const [currentTag, setCurrentTag] = useState(null);
  const [notes, setNotes] = useState([]);
  const [keyword, setKeyword] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { ref } = useOutletContext<ContextType>();
  const { actions } = useNotes(ref);
  const [searchResults, setSearchResults] = useState([]);
  let location = useLocation();
  const currentNote = useApp((state) => state.currentNote);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    getAllTags(controller, isMounted);
    setMode(location.state.mode);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [location.state]);

  const debouncedHandleSearch = useCallback(
    debounce(async (keyword) => {
      const res = allTags.filter((tag) => tag.label.includes(keyword));
      setSearchResults(res);
    }, 500),
    []
  );

  const handleInputOnchange = (e) => {
    const { value } = e.target;
    console.log(value == "");
    setKeyword(value.target);
    debouncedHandleSearch(value);
  };

  const renderResults = (res) => {
    return res.map((item, idx) => {
      return (
        <Button
          variant="ghost"
          key={idx}
          borderRadius={0}
          w="100%"
          pt={3}
          pb={3}
          borderTop={idx == 0 ? "1px" : "0px"}
          borderBottom="1px"
          borderColor="gray.200"
          display="flex"
          justifyContent="flex-start"
          height="fit-content"
          gap={2}
          onClick={async () => {
            setCurrentTag(item);
            const res = await getNotesInTag(item.id);
            setNotes(res);
            setMode("notes");
          }}
        >
          <IoMdPricetag size={30} color="#7540EE" />
          <Text fontWeight="normal">{item.label}</Text>
        </Button>
      );
    });
  };

  if (mode == "tags")
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create a new tag</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={5} color="text.inactive">
                Tags let you add keywords to notes, making them easier to find
                and browse.
              </Text>
              <Text ml={1} fontSize="sm" mb={1}>
                Name
              </Text>
              <Input
                value={tagName}
                onChange={(e) => {
                  setTagName(e.target.value);
                }}
                placeholder="Tag name"
                size="lg"
              />
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="brand"
                mr={3}
                onClick={() => {
                  createTag(tagName, null, false);
                  onClose();
                }}
              >
                Create
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Flex justify="space-between" mb="1em" pl="2em" pr="2em" id="notes">
          <Text fontSize="2xl" fontWeight="600">
            Tags
          </Text>
          <Flex gap={3}>
            <Tooltip label="Create a tag">
              <Button
                style={{
                  height: "40px",
                  width: "40px",
                  padding: "7px",
                  borderRadius: "50%",
                  background: "var(--brand400)",
                }}
                onClick={onOpen}
              >
                <FaPlus color="white" />
              </Button>
            </Tooltip>
          </Flex>
        </Flex>
        <InputGroup mb={4}>
          <InputLeftElement pointerEvents="none">
            <IoSearch size="24px" color="var(--brand400)" />
          </InputLeftElement>
          <Input
            value={keyword}
            onChange={handleInputOnchange}
            placeholder="Search your tag"
            size="lg"
          />
        </InputGroup>

        {searchResults && searchResults.length ? (
          renderResults(searchResults)
        ) : keyword != "" ? (
          <Text>No tags found</Text>
        ) : (
          renderResults(allTags)
        )}
      </>
    );
  else if (mode == "notes") {
    return (
      <>
        <Flex
          justify="flex-start"
          mb="1em"
          pl="2em"
          pr="2em"
          gap={2}
          id="notes"
        >
          <IoMdPricetag size={30} color="#7540EE" />
          <Text fontSize="2xl" fontWeight="600">
            {currentTag.value}
          </Text>
        </Flex>
        {notes && notes.length ? (
          notes.map((item, idx) => {
            return (
              <Button
                variant="ghost"
                key={idx}
                borderRadius={0}
                w="100%"
                pt={3}
                pb={3}
                borderTop={idx == 0 ? "1px" : "0px"}
                borderBottom="1px"
                borderColor="gray.200"
                display="flex"
                justifyContent="flex-start"
                height="fit-content"
                gap={2}
                onClick={() => {
                  actions.clickANoteHandler(item.id);
                  setNotes([
                    ...notes.slice(0, idx),
                    {
                      ...notes[idx],
                      title: currentNote?.title,
                    },
                    ...notes.slice(idx + 1),
                  ]);
                }}
              >
                <Text fontWeight="normal">{item.title}</Text>
              </Button>
            );
          })
        ) : (
          <Text ml={10} color="text.inactive">
            No notes found
          </Text>
        )}
      </>
    );
  }
};
