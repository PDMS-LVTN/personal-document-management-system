import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useAccordionItemState,
  useDisclosure,
} from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import BlackPlusIcon from "../assets/black-plus-icon.svg";
import BlackOptionsIcon from "../assets/black-options-icon.svg";
import { useApp } from "../store/useApp";
import useNotes from "../hooks/useNotes";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";

const TreeItem = ({
  noteItem,
  localTreeItems,
  setLocalTreeItems,
  isExpanded,
  editorRef,
  index,
}) => {
  const { onOpen } = useAccordionItemState();
  const currentNote = useApp((state) => state.currentNote);
  const setCurrentTree = useApp((state) => state.setCurrentTree);
  const setTree = useApp((state) => state.setTree);
  const treeItems = useApp((state) => state.treeItems);
  const { isLoading, actions } = useNotes(editorRef);
  const { onClose } = useDisclosure();

  const handleInputChange = async (e) => {
    console.log("in menu");
    const response = await actions.getANote(noteItem.id);
    const newNote = await actions.importNote(noteItem.id, e.target.files[0]);
    console.log("in menu");
    console.log(response);
    setLocalTreeItems([
      ...localTreeItems.slice(0, index),
      {
        ...localTreeItems[index],
        childNotes: [
          ...response.childNotes,
          { id: newNote.id, title: newNote.title },
        ],
      },
      ...localTreeItems.slice(index + 1),
    ]);
    if (!isExpanded) onOpen();
  };

  // const setCurrentNote = useApp((state) => state.setCurrentNote);
  return (
    <Flex
      justifyContent="space-between"
      w="100%"
      bgColor={currentNote?.id === noteItem?.id ? "brand.50" : ""}
    >
      <Modal isOpen={isLoading} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={4}
          >
            <Text fontSize="xl" fontWeight="50" color="brand.300">
              Importing...
            </Text>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="brand.300"
              size="md"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <AccordionButton
        onClick={async () => {
          // expose the current tree's state
          setCurrentTree(localTreeItems, setLocalTreeItems);
          const children = await actions.clickANoteHandler(noteItem.id);
          if (isExpanded) {
            return;
          }
          // update child notes on client side
          console.log(children);
          let updatedTreeItems = [
            ...localTreeItems.slice(0, index),
            {
              ...localTreeItems[index],
              childNotes: children.childNotes,
            },
            ...localTreeItems.slice(index + 1),
          ];
          setLocalTreeItems(updatedTreeItems);
        }}
        justifyContent="space-between"
      >
        <Flex alignItems="center">
          <AccordionIcon mr={3} />
          <Text>
            {currentNote?.id === noteItem?.id
              ? currentNote.title
              : noteItem?.title}
          </Text>
        </Flex>
      </AccordionButton>
      <Flex alignItems="center" mr={3}>
        <Menu>
          <MenuButton
            height="40px"
            width="40px"
            padding="7px"
            transition="all 0.2s"
            borderRadius="50%"
            _hover={{ bg: "gray.100" }}
            _expanded={{ bg: "blue.100" }}
            // _focus={{ boxShadow: 'outline' }}
          >
            <img src={BlackOptionsIcon} alt="options" />
          </MenuButton>
          <MenuList>
            <MenuItem>Edit Note</MenuItem>
            <MenuItem>Rename Note</MenuItem>
            <MenuItem>Copy Link</MenuItem>
            <MenuDivider />
            <MenuItem
              onClick={() => {
                actions.deleteNote(noteItem?.id);
                if (!noteItem.parent) {
                  setTree([
                    ...treeItems.slice(0, index),
                    ...treeItems.slice(index + 1),
                  ]);
                } else
                  setLocalTreeItems([
                    ...localTreeItems.slice(0, index),
                    ...localTreeItems.slice(index + 1),
                  ]);
              }}
            >
              Delete Note
            </MenuItem>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton
            height="40px"
            width="40px"
            padding="7px"
            borderRadius="50%"
            marginLeft="0.5em"
          >
            <img src={BlackPlusIcon} alt="plus icon" />
          </MenuButton>
          <MenuList>
            <MenuItem
              position={"relative"}
              onClick={async () => {
                const response = await actions.getANote(noteItem.id);
                const newNote = await actions.createNote(noteItem.id);
                console.log("in menu");
                console.log(response);
                setLocalTreeItems([
                  ...localTreeItems.slice(0, index),
                  {
                    ...localTreeItems[index],
                    childNotes: [
                      ...response.childNotes,
                      { id: newNote.id, title: newNote.title },
                    ],
                  },
                  ...localTreeItems.slice(index + 1),
                ]);
                if (!isExpanded) onOpen();
              }}
            >
              Create new note
            </MenuItem>
            <MenuItem>
              <span>Import file</span>
              <input
                style={{
                  opacity: 0,
                  zIndex: 5,
                  position: "absolute",
                  maxWidth: "200px",
                  cursor: "pointer",
                }}
                accept=".docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                type="file"
                className="upload-file"
                name="upload_file"
                onChange={handleInputChange}
              />
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export const TreeView = ({ data, editorRef }) => {
  const [treeItems, setTreeItems] = useState(data);
  useEffect(() => {
    setTreeItems(data);
  }, [data]);

  return (
    <Accordion allowMultiple>
      {treeItems && treeItems.length
        ? treeItems.map((noteItem, index) => (
            <Fragment key={index}>
              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                    <TreeItem
                      noteItem={noteItem}
                      localTreeItems={treeItems}
                      setLocalTreeItems={setTreeItems}
                      isExpanded={isExpanded}
                      editorRef={editorRef}
                      index={index}
                    />
                    <AccordionPanel>
                      {noteItem.childNotes && noteItem.childNotes.length ? (
                        // <Suspense fallback={<Spinner />}>
                        <TreeView
                          data={noteItem.childNotes}
                          editorRef={editorRef}
                        />
                      ) : (
                        // </Suspense>
                        <Text ml={8} color="text.inactive">
                          No pages inside
                        </Text>
                      )}
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            </Fragment>
          ))
        : null}
    </Accordion>
  );
};
