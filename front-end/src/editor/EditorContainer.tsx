import { useState } from "react";
import Editor from "./Editor";
import ConfirmModal from "../components/ConfirmModal";
import Arial from "../assets/fonts/Arial/SVN-Arial Regular.ttf";
import ArialBold from "../assets/fonts/Arial/SVN-Arial Bold.ttf";
import ArialItalic from "../assets/fonts/Arial/SVN-Arial Italic.ttf";
import ArialBoldItalic from "../assets/fonts/Arial/SVN-Arial Bold Italic.ttf";
import Times from "../assets/fonts/Times/SVN-Times New Roman.ttf";
import TimesBold from "../assets/fonts/Times/SVN-Times New Roman Bold.ttf";
import TimesItalic from "../assets/fonts/Times/SVN-Times New Roman Italic.ttf";
import TimesBoldItalic from "../assets/fonts/Times/SVN-Times New Roman Bold Italic.ttf";
import {
  Button,
  Flex,
  Tooltip,
  FormControl,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { FaRegStar, FaStar, FaRegSave } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { TbFileExport } from "react-icons/tb";
import { useApp } from "../store/useApp";
import useNotes from "../hooks/useNotes";
import { useFavorite } from "../hooks/useFavorite";
import { useTags } from "../hooks/useTags";
import { CreatableSelect } from "chakra-react-select";
import { IoMdPricetag } from "react-icons/io";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import { jsPDF } from "jspdf";

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

  const fonts = [
    { path: Arial, name: "Arial", size: "normal" },
    { path: ArialBold, name: "Arial", size: "bold" },
    { path: ArialItalic, name: "Arial", size: "italic" },
    { path: ArialBoldItalic, name: "Arial", size: "bolditalic" },
    { path: Times, name: "times", size: "normal" },
    { path: TimesBold, name: "times", size: "bold" },
    { path: TimesItalic, name: "times", size: "italic" },
    { path: TimesBoldItalic, name: "times", size: "bolditalic" },
  ];

  const handelExportFile = async () => {
    const doc = new jsPDF();

    async function convertTTFToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsDataURL(file);
      });
    }

    for (const font of fonts) {
      const response = await fetch(font.path);
      const blob = await response.blob();
      const file = new File([blob], 'font.ttf', { type: "font/ttf" });
      const base64String = await convertTTFToBase64(file);
      doc.addFileToVFS('font.ttf', base64String);
      doc.addFont('font.ttf', font.name, font.size);
    }
    
    const content = editorRef.current.firstChild;
    console.log(doc.getFontList());

    doc.html(content, {
      async callback(doc) {
        await doc.save(`${currentNote.title}.pdf`);
      },
      margin: [20, 0, 20, 20],
      html2canvas: { scale: 0.25 },
    });
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
            <MdOutlineDelete size={22} color="var(--brand400)" />
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
            <FaRegSave size={19} color="var(--brand400)" />
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
        <Tooltip label="Export file">
          <Button
            isDisabled={currentNote === undefined}
            variant="ghost"
            style={{
              height: "40px",
              width: "40px",
              padding: "7px",
              borderRadius: "50%",
            }}
            onClick={handelExportFile}
          >
            <TbFileExport size={21} color="var(--brand400)" />
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
