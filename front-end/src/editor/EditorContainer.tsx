import { Fragment, useState } from "react";
import Editor from "./Editor";
import ConfirmModal from "../components/ConfirmModal";
import { Button, Flex, Tooltip } from "@chakra-ui/react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useApp } from "../store/useApp";
import TrashCanIcon from "../assets/trashcan-icon.svg";
import SaveIcon from "../assets/save-icon.svg";
import useNotes from "../hooks/useNotes";
import { useFavorite } from "../hooks/useFavorite";

function EditorContainer({ editorRef }) {
  const currentNote = useApp((state) => state.currentNote);
  const [confirmDeleteNote, setConfirmDelete] = useState(false);

  const onCloseConfirm = () => {
    setConfirmDelete(false);
  };

  const { actions } = useNotes(editorRef);
  const { updateFavorite } = useFavorite();

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
      <Editor editorRef={editorRef} />
    </Fragment>
  );
}

export default EditorContainer;
