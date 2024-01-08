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
import DownCaret from "../../assets/down-caret.svg";
import BlackPlusIcon from "../../assets/black-plus-icon.svg";
import BlackOptionsIcon from "../../assets/black-options-icon.svg";
import BlackDotIcon from "../../assets/black-dot-icon.svg";
import TrashCanIcon from "../../assets/trashcan-icon.svg";
import PinIcon from "../../assets/pin-icon.svg";
import { Suspense, forwardRef } from "react";
import { useApp } from "../../store/useApp";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";

type Props = {
  notes: any[];
  handler: {
    createNote: (id) => void;
    clickANoteHandler: (id) => void;
    deleteNote: () => void;
    updateNote: () => void;
  };
  isLoading: boolean;
};
type Ref = MDXEditorMethods;

const Notes = forwardRef<Ref, Props>((props, ref) => {
  const { notes, handler, isLoading } = props;
  const currentNote = useApp((state) => state.currentNote);
  const { onClose } = useDisclosure();

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
        {notes.length > 0 ? (
          notes.map((noteItem) => {
            return (
              <Suspense key={noteItem?.id} fallback={<Skeleton />}>
                <Flex
                  justify="space-between"
                  bgColor={currentNote?.id === noteItem?.id ? "brand.50" : ""}
                  className="note"
                  pl="2em"
                  pr="2em"
                >
                  <Flex alignItems="center">
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
                      <img src={DownCaret} alt="down-caret" />
                    </Button>
                    <Button
                      ml="-1em"
                      variant="ghost"
                      onClick={() => handler.clickANoteHandler(noteItem?.id)}
                    >
                      {noteItem?.title}
                    </Button>
                  </Flex>
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
                      <img src={BlackOptionsIcon} alt="options" />
                    </Button>
                    <Button
                      variant="ghost"
                      style={{
                        height: "40px",
                        width: "40px",
                        padding: "7px",
                        borderRadius: "50%",
                      }}
                      onClick={() => handler.createNote(noteItem?.id)}
                    >
                      <img src={BlackPlusIcon} alt="plus icon" />
                    </Button>
                  </div>
                </Flex>
              </Suspense>
            );
          })
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
              onClick={handler.deleteNote}
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
              <img src={PinIcon} alt="save-note" />
            </Button>
          </Tooltip>
        </Flex>
        {/* There is only one editor instance.       */}
        {/* This editor is shared between all notes. */}
        {currentNote ? (
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
