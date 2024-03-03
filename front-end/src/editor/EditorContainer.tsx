import { useState } from "react";
import Editor from "./Editor";
import ConfirmModal from "../components/ConfirmModal";
import {
  Button,
  Flex,
  Tooltip,
  FormControl,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useApp } from "../store/useApp";
import TrashCanIcon from "../assets/trashcan-icon.svg";
import SaveIcon from "../assets/save-icon.svg";
import useNotes from "../hooks/useNotes";
import { useFavorite } from "../hooks/useFavorite";
import { useTags } from "../hooks/useTags";
import { CreatableSelect } from "chakra-react-select";
import { IoMdPricetag } from "react-icons/io";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";

function EditorContainer({ editorRef }) {
  const currentNote = useApp((state) => state.currentNote);
  const [confirmDeleteNote, setConfirmDelete] = useState(false);
  const { onClose } = useDisclosure();

  const handleCloseConfirm = () => {
    setConfirmDelete(false);
  };

  const { isLoading, actions } = useNotes(editorRef);
  const { updateFavorite } = useFavorite();
  const { createTag, deleteTagInNote, applyTag } = useTags();

  const currentTags = useApp((state) => state.currentTags);
  // console.log("currenttag", currentTags);
  const setCurrentTags = useApp((state) => state.setCurrentTags);
  const allTags = useApp((state) => state.allTags);
  const setAllTags = useApp((state) => state.setAllTags);

  const handleChange = (selected) => {
    if (selected.length > currentTags.length) {
      const newTag = selected[selected.length - 1];
      applyTag(newTag.id, currentNote.id);
      setCurrentTags([...currentTags, newTag]);
    } else {
      const deletedTag = currentTags.filter(
        (tag) => !selected.includes(tag)
      )[0];
      deleteTagInNote(deletedTag.id, currentNote.id);
      setCurrentTags(currentTags.filter((tag) => tag.id !== deletedTag.id));
    }
  };

  const handleCreate = async (inputValue: string) => {
    const { responseData } = await createTag(inputValue, currentNote.id);
    const newTag = { label: inputValue, id: responseData.id };
    setCurrentTags([...currentTags, newTag]);
    setAllTags([...allTags, newTag]);
  };

  return (
    <>
      {/* BUG: where is the spinner? */}
      {/* FIX: https://stackoverflow.com/questions/73031972/how-to-get-state-from-custom-hooks-to-update-in-parent-component */}
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
      <ConfirmModal
        modalTitle="Delete note"
        config={currentNote?.title}
        isOpen={confirmDeleteNote}
        confirmDelete={() => actions.deleteNote(currentNote.id)}
        close={handleCloseConfirm}
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
            onClick={actions.updateNote}
          >
            <img src={SaveIcon} alt="save-note" />
          </Button>
        </Tooltip>
        <Tooltip label="Favorite">
          <Button
            isDisabled={currentNote === undefined}
            variant="ghost"
            style={{
              height: "40px",
              width: "40px",
              padding: "1px",
              borderRadius: "50%",
            }}
            onClick={updateFavorite}
          >
            {currentNote?.is_favorited ? (
              <FaStar size={20} color="var(--brand400)" />
            ) : (
              <FaRegStar size={20} color="var(--brand400)" />
            )}
          </Button>
        </Tooltip>
      </Flex>
      {currentNote && (
        <Flex pos="absolute" bottom={0} zIndex={3} left={0} right={0} p={2}>
          <Tooltip
            shouldWrapChildren={true}
            label="Your note belongs to these tags"
          >
            <IoMdPricetag size={40} color="var(--brand400)" />
          </Tooltip>
          <FormControl ml={3}>
            <CreatableSelect
              id="input-tags"
              isMulti
              // name="tags"
              options={allTags}
              menuPlacement="top"
              placeholder="Select some tags..."
              value={currentTags}
              isClearable={false}
              onCreateOption={handleCreate}
              onChange={handleChange}
            />
          </FormControl>
        </Flex>
      )}

      <Editor editorRef={editorRef} />
    </>
  );
}

export default EditorContainer;
