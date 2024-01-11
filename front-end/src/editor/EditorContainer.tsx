import { Fragment, useState } from "react";
import Editor from "./Editor";
import ConfirmModal from "../components/ConfirmModal";
import {
  Button,
  Flex,
  Tooltip,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useApp } from "../store/useApp";
import TrashCanIcon from "../assets/trashcan-icon.svg";
import SaveIcon from "../assets/save-icon.svg";
import useNotes from "../hooks/useNotes";
import { useFavorite } from "../hooks/useFavorite";
import { useTags } from "../hooks/useTags";
import { CreatableSelect } from "chakra-react-select";

function EditorContainer({ editorRef }) {
  const currentNote = useApp((state) => state.currentNote);
  const [confirmDeleteNote, setConfirmDelete] = useState(false);

  const onCloseConfirm = () => {
    setConfirmDelete(false);
  };

  const { actions } = useNotes(editorRef);
  const { updateFavorite } = useFavorite();
  const { createTag, deleteTagInNote } = useTags();

  const currentTags = useApp((state) => state.currentTags);
  const setCurrentTags = useApp((state) => state.setCurrentTags);

  const allTags = useApp((state) => state.allTags);
  const setAllTags = useApp((state) => state.setAllTags);

  const handerChange = (e) => {
    if (e.length > currentTags.length) {
      const newTag = e[e.length - 1].value;
      createTag(newTag, currentNote.id, true);
    }
    else {
      const deletedTag = currentTags.filter(tag => !e.includes(tag));
      deleteTagInNote(deletedTag[0].id, currentNote.id);
    }
  }

  return (
    <Fragment>
      <ConfirmModal
        modalTitle="Delete note"
        config={currentNote?.title}
        isOpen={confirmDeleteNote}
        confirmDelete={() => actions.deleteNote(currentNote.id)}
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
              <FaStar size={20} color="#7540EE" />
            ) : (
              <FaRegStar size={20} color="#7540EE" />
            )}
          </Button>
        </Tooltip>
      </Flex>
      <Flex>
      <FormControl p={4}>
        {/* <FormLabel>Select with creatable options</FormLabel> */}
        <CreatableSelect
          id="input-tags"
          isMulti
          name="colors"
          options={allTags}
          placeholder="Select some tags..."
          value={currentTags}
          closeMenuOnSelect={false}
          onCreateOption={(newTag) => createTag(newTag, currentNote.id, false)}
          onChange={(options) => handerChange(options)}
        />
      </FormControl>
      </Flex>
      
      <Editor editorRef={editorRef} />
    </Fragment>
  );
}

export default EditorContainer;

