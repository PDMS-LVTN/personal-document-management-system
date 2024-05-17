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
import ConfirmModal from "../../components/ConfirmModal";
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
  notes,
  actions,
  isLoading,
}: {
  notes: Note[];
  actions;
  isLoading;
}) => {
  const [term, setTerm] = useState("");
  const [toggle, setToggle] = useState<boolean>(false);
  const treeRef = useRef<TreeApi<Note>>(null);
  const [data, setData, controller] = useTree(notes);
  const currentNote = useApp((state) => state.currentNote);
  const isMerge = useApp((state) => state.isMerge);
  const setIsMerge = useApp((state) => state.setIsMerge);
  const [confirmMergeNote, setConfirmMergeNote] = useState(false);

  // set editor content when clicking on each note
  const handleActivate = async (e: NodeApi<Note>) => {
    const focusedNode = treeRef.current.focusedNode;
    const id = focusedNode?.id;
    if (isMerge) {
      setConfirmMergeNote(true);
    } else if (id) await actions.clickANoteHandler(focusedNode.id);
  };

  const handleMergeNote = async () => {
    const id = window.note_tree?.focusedNode?.id;
    const dragIds = currentNote.childNotes.map((note) => note.id);
    controller.onMove({
      dragIds: dragIds,
      parentId: id,
      index: treeRef.current.root.children?.length,
    });
    if (id) {
      window.note_tree.delete(currentNote.id);
      await actions.mergeNotes(currentNote.id, id);
      const notes = await actions.getAllNotes(controller);
      setData(notes);
      setIsMerge(false);
    }
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
    // if (currentNote) {
    //   treeRef.current.focus(currentNote.id);
    // }
    window.note_tree = treeRef.current;
  }, []);

  const { onOpen, isOpen, onClose } = useDisclosure();
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <ConfirmModal
        modalTitle="Confirm merge note"
        config={currentNote?.title}
        isOpen={confirmMergeNote}
        confirmDelete={handleMergeNote}
        close={() => setConfirmMergeNote(false)}
        action={"merge"}
      />
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
              Processing...
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
          <Tooltip label={toggle ? "Collapse all" : "Expand all"}>
            <Button
              variant="ghost"
              // mr="0.5em"
              style={{
                height: "40px",
                width: "40px",
                padding: "8px",
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
              onClick={onOpen}
            >
              <SlidersHorizontal color="var(--brand400)" />
            </Button>
          </Tooltip>
          {/* <Tooltip label="Add"> */}
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
                  value={inputValue}
                  onClick={() => setInputValue("")}
                  onChange={handleInputChange}
                />
              </MenuItem>
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
          value={term}
          fontSize={"14px"}
          ml={1}
          onChange={(e) => setTerm(e.target.value)}
        />
      </InputGroup>
      {/* {data && data.length ? ( */}
      {/* //  <div className=data.length == 0 ? "hide" : ""> */}
      {isMerge ? (
        <div
          style={{
            display: "flex",
            backgroundColor: "var(--brand300",
            justifyContent: "center",
          }}
          className="mt-1 p-1.5"
        >
          <Text className="mr-3" color={"white"} fontSize={"13px"}>
            Choose a note to merge
          </Text>
          <Button
            onClick={async () => {
              setIsMerge(false);
              const notes = await actions.getAllNotes(controller);
              setData(notes);
            }}
            size={"xs"}
            colorScheme={"red"}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div style={{ display: "flex" }} className="mt-10"></div>
      )}
      <Tree
        ref={treeRef}
        data={data}
        {...controller}
        openByDefault={false}
        width="100%"
        indent={24}
        rowHeight={40}
        overscanCount={1}
        onMove={async (args) => {
          controller.onMove(args);
          await actions.moveNote(args.dragIds, args.parentId);
        }}
        paddingBottom={10}
        searchTerm={term}
        searchMatch={(node, term) =>
          node.data.title.toLowerCase().includes(term.toLowerCase())
        }
        childrenAccessor={(d) => d.childNotes}
        onActivate={handleActivate}
        selection={currentNote?.id || "0"}
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
