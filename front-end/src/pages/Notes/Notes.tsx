import {
  Button,
  Flex,
  Skeleton,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import ToolsIcon from "../../assets/tools-icon.svg";
import PlusIcon from "../../assets/plus-icon.svg";
import { Suspense, forwardRef } from "react";
import { useApp } from "../../store/useApp";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import { TreeView } from "../../components/TreeView";
import useNotes from "../../hooks/useNotes";

// const Notes = forwardRef<Ref, Props>((props, ref) => {
const Notes = ({ editorRef }) => {
  const { onClose } = useDisclosure();

  const treeItems = useApp((state) => state.treeItems);
  const { isLoading, actions } = useNotes(editorRef);

  return (
    <>
    {/*BUG: where is the spinner?*/}
      <Modal isOpen={isLoading} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody display="flex" justifyContent="center">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Flex justify="space-between" mb="1em" pl="2em" pr="2em" id="notes">
        <Text fontSize="2xl" fontWeight="600">
          Notes
        </Text>
        <div>
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
            <img src={ToolsIcon} alt="tools" />
          </Button>
          <Tooltip label="Add">
            <Button
              style={{
                height: "40px",
                width: "40px",
                padding: "7px",
                borderRadius: "50%",
                background: "var(--brand400)",
              }}
              onClick={() => actions.createNote(null)}
            >
              <img src={PlusIcon} alt="create" />
            </Button>
          </Tooltip>
        </div>
      </Flex>
      {treeItems && treeItems.length > 0 ? (
        <Suspense fallback={<Skeleton />}>
          <TreeView data={treeItems} editorRef={editorRef} />
        </Suspense>
      ) : (
        <Text pl="2em" pr="2em" color="text.inactive">
          Click <strong>Add</strong> to create a new note
        </Text>
      )}
    </>
  );
};

export default Notes;
