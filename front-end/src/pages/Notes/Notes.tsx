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
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { Tree, TreeApi } from "react-arborist";
import PlusIcon from "../../assets/plus-icon.svg";
import { useState, useRef, useEffect } from "react";
import { Note, useApp } from "../../store/useApp";
import Node from "./Node";
import { IoSearch } from "react-icons/io5";
import { useTree } from "@/hooks/useTree";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import { NodeApi } from "react-arborist";
import SearchFilter from "@/components/SearchFilter";
import {
  ChevronsDownUp,
  ChevronsUpDown,
  SlidersHorizontal,
} from "lucide-react";

declare global {
  interface Window {
    note_tree: TreeApi<Note> | null;
  }
}

const Notes = ({
  editorRef,
  notes,
  actions,
  isLoading,
}: {
  editorRef;
  notes: Note[];
  actions;
  isLoading;
}) => {
  const [term, setTerm] = useState("");
  const [toggle, setToggle] = useState<boolean>(false);
  const treeRef = useRef<TreeApi<Note>>(null);
  const [data, controller] = useTree(notes, actions);
  const currentNote = useApp((state) => state.currentNote);

  // set editor content when clicking on each note
  const handleActivate = async (e: NodeApi<Note>) => {
    const focusedNode = treeRef.current.focusedNode;
    const id = focusedNode?.id;
    console.log(id);
    // const title = focusedNode?.data.title;
    // if (id === "temp") {
    //   let parent_id = null;
    //   const level = focusedNode.level;
    //   if (level) parent_id = focusedNode.parent.data.id;
    //   const response = await actions.createNote(parent_id, title);
    //   focusedNode.id = response.id;
    //   focusedNode.data.id = response.id;
    // }
    if (id) await actions.clickANoteHandler(focusedNode.id);
  };

  const handleInputChange = async (e) => {
    const res = await actions.importNote(null, e.target.files[0]);
    res &&
      treeRef.current.create({
        type: "internal",
        parentId: "null" + "," + res.id + "," + res.title,
        index: treeRef.current.root.children?.length,
      });
  };

  const handleCreateNote = async () => {
    const res = await actions.createNote(null);
    treeRef.current.create({
      type: "internal",
      parentId: "null" + "," + res.id + "," + res.title,
      index: treeRef.current.root.children?.length,
    });
  };

  useEffect(() => {
    if (currentNote) {
      treeRef.current.focus(currentNote.id);
    }
    window.note_tree = treeRef.current;
  }, []);

  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <>
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
      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <SearchFilter editorRef={null} close={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Flex justify="space-between" mb="1em" pl="2em" pr="2em" id="notes">
        <Text fontSize="2xl" fontWeight="600">
          Notes
        </Text>
        <div>
          <Tooltip label={toggle ? "Collapse all" : "Expand all"}>
            <Button
              variant="ghost"
              style={{
                height: "40px",
                width: "40px",
                padding: "7px",
                borderRadius: "50%",
              }}
              onClick={() => {
                if (!toggle) treeRef.current?.openAll();
                else treeRef.current?.closeAll();
                setToggle(!toggle);
              }}
            >
              {toggle ? (
                <ChevronsDownUp color="var(--brand400)" />
              ) : (
                <ChevronsUpDown color="var(--brand400)" />
              )}
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
          {/* <Tooltip label="Add"> */}
          <Menu>
            <MenuButton
              height="40px"
              width="40px"
              padding="12px"
              // transition="all 0.2s"
              borderRadius="50%"
              background="var(--brand400)"
            >
              <img src={PlusIcon} alt="create" />
            </MenuButton>
            <MenuList>
              <MenuItem
                position={"relative"}
                onClick={(e) => {
                  e.stopPropagation();
                  // treeRef.current.create({
                  //   type: "internal",
                  //   parentId: null,
                  //   index: treeRef.current.root.children?.length,
                  // });
                  handleCreateNote();
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
                  accept=".docx"
                  type="file"
                  className="upload-file"
                  name="upload_file"
                  onChange={handleInputChange}
                />
              </MenuItem>
            </MenuList>
          </Menu>
          {/* <Button
              style={{
                height: "40px",
                width: "40px",
                padding: "7px",
                borderRadius: "50%",
                background: "var(--brand400)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                treeRef.current.create({
                  type: "internal",
                  parentId: null,
                  index: treeRef.current.root.children?.length,
                });
              }}
            >
              <FaPlus color="white" />
            </Button>
          </Tooltip> */}
        </div>
      </Flex>
      <InputGroup pl="2em" pr="2em" w="100%">
        <InputLeftElement pointerEvents="none" ml="2em">
          <IoSearch size="24px" color="var(--brand400)" />
        </InputLeftElement>
        <Input
          m={0}
          type="text"
          placeholder="Search..."
          className="search-input"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </InputGroup>
      {/* {data && data.length ? ( */}
      {/* //  <div className=data.length == 0 ? "hide" : ""> */}
      <Tree
        ref={treeRef}
        data={data}
        {...controller}
        openByDefault={false}
        width="100%"
        indent={24}
        rowHeight={40}
        overscanCount={1}
        paddingTop={30}
        paddingBottom={10}
        padding={25 /* sets both */}
        searchTerm={term}
        searchMatch={(node, term) =>
          node.data.title.toLowerCase().includes(term.toLowerCase())
        }
        childrenAccessor={(d) => d.childNotes}
        onActivate={handleActivate}
      >
        {Node}
      </Tree>
      {/* ) : ( */}
      {/* // </div> */}

      {/* // <div className={data.length ? "hide" : ""}>
        <Text pl="2em" pr="2em" paddingTop="1rem" color="text.inactive">
          Click <strong>Add</strong> to create a new note
        </Text> */}
      {/* // </div> */}
      {/* )} */}
    </>
  );
};

export default Notes;
