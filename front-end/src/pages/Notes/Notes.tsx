import {
  Button,
  Flex,
  GridItem,
  Skeleton,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { ALL_PLUGINS } from "../../editor/_boilerplate";
import { MDXEditor, MDXEditorMethods } from "@mdxeditor/editor";
import ToolsIcon from "../../assets/tools-icon.svg";
import PlusIcon from "../../assets/plus-icon.svg";

import TrashCanIcon from "../../assets/trashcan-icon.svg";
import SaveIcon from "../../assets/save-icon.svg";
import { Suspense, forwardRef, useState } from "react";
import { useApp } from "../../store/useApp";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import ConfirmModal from "../../components/ConfirmModal";
import { TreeView } from "../../components/TreeView";

type Props = {
  handler: {
    createNote: (id) => any;
    clickANoteHandler: (id) => any;
    getANote: (id) => any;
    deleteNote: () => void;
    updateNote: () => void;
  };
  isLoading: boolean;
};
type Ref = MDXEditorMethods;

const Notes = forwardRef<Ref, Props>((props, ref) => {
  const { handler, isLoading } = props;
  const currentNote = useApp((state) => state.currentNote);
  const { onClose } = useDisclosure();
  const [confirmDeleteNote, setConfirmDelete] = useState(false);

  const treeItems = useApp((state) => state.treeItems);

  const onCloseConfirm = () => {
    setConfirmDelete(false);
  };

  const actions = {
    getNote: handler.getANote,
    createNote: handler.createNote,
    clickNote: handler.clickANoteHandler
  };

  return (
    <>
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
      <GridItem
        id="notes"
        rowSpan={1}
        colSpan={3}
        bg="#FAF9FE"
        pos="relative"
        pt="1em"
        overflowY="auto"
      >
        <Flex justify="space-between" mb="1em" pl="2em" pr="2em">
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
                onClick={() => handler.createNote(null)}
              >
                <img src={PlusIcon} alt="create" />
              </Button>
            </Tooltip>
          </div>
        </Flex>
        {treeItems.length > 0 ? (
          <Suspense fallback={<Skeleton />}>
            <TreeView data={treeItems} actions={actions} />
          </Suspense>
        ) : (
          <Text pl="2em" pr="2em" color="text.inactive">
            Click <strong>Add</strong> to create a new note
          </Text>
        )}
      </GridItem>
      <GridItem
        id="editor"
        rowSpan={1}
        colSpan={6}
        bg="white"
        sx={{ overflowY: "scroll" }}
      >
        <ConfirmModal
          modalTitle="Delete note"
          config={currentNote?.title}
          isOpen={confirmDeleteNote}
          confirmDelete={handler.deleteNote}
          close={onCloseConfirm}
        />
        <Flex justifyContent="right">
          <Tooltip label="Delete note">
            <Button
              isDisabled={currentNote === undefined}
              variant="ghost"
              style={{
                height: "40px",
                width: "40px",
                padding: "7px",
                borderRadius: "50%",
              }}
              onClick={() => {
                setConfirmDelete(true);
              }}
            >
              <img src={TrashCanIcon} alt="delete-note" />
            </Button>
          </Tooltip>
          <Tooltip label="Save note">
            <Button
              isDisabled={currentNote === undefined}
              variant="ghost"
              style={{
                height: "40px",
                width: "40px",
                padding: "7px",
                borderRadius: "50%",
              }}
              onClick={handler.updateNote}
            >
              <img src={SaveIcon} alt="save-note" />
            </Button>
          </Tooltip>
        </Flex>
        {/* There is only one editor instance.       */}
        {/* This editor is shared between all notes. */}
        {currentNote && currentNote.content ? (
          <Suspense fallback={<Skeleton />}>
            <MDXEditor
              ref={ref}
              markdown={currentNote.content}
              // onChange={() => {}}
              plugins={ALL_PLUGINS}
              contentEditableClassName="prose prose-lg inside-editor max-w-full"
            />
          </Suspense>
        ) : (
          <Text pl="2em" pr="2em" color="text.inactive">
            <strong>Select</strong> or <strong>Create</strong> a new note to
            edit
          </Text>
        )}
      </GridItem>
    </>
  );
});

export default Notes;
