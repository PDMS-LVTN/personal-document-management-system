import { useCallback, useEffect, useState } from "react";
import Editor from "./Editor";
import ConfirmModal from "../components/ConfirmModal";

import Montserract from "../assets/fonts/Montserrat/Montserrat-Regular.ttf";
import MontserractBold from "../assets/fonts/Montserrat/Montserrat-Bold.ttf";
import MontserractItalic from "../assets/fonts/Montserrat/Montserrat-Italic.ttf";
import MontserractBoldItalic from "../assets/fonts/Montserrat/Montserrat-BoldItalic.ttf";

import Times from "../assets/fonts/Times/SVN-Times New Roman.ttf";
import TimesBold from "../assets/fonts/Times/SVN-Times New Roman Bold.ttf";
import TimesItalic from "../assets/fonts/Times/SVN-Times New Roman Italic.ttf";
import TimesBoldItalic from "../assets/fonts/Times/SVN-Times New Roman Bold Italic.ttf";

import Vollkorn from "../assets/fonts/Vollkorn/Vollkorn-Regular.ttf";
import VollkornBold from "../assets/fonts/Vollkorn/Vollkorn-Bold.ttf";
import VollkornItalic from "../assets/fonts/Vollkorn/Vollkorn-Italic.ttf";
import VollkornBoldItalic from "../assets/fonts/Vollkorn/Vollkorn-BoldItalic.ttf";

import Courier from "../assets/fonts/Courier/cour.ttf";
import CourierBold from "../assets/fonts/Courier/courbd.ttf";
import CourierItalic from "../assets/fonts/Courier/couri.ttf";
import CourierBoldItalic from "../assets/fonts/Courier/courbi.ttf";

import BeVietnamPro from "../assets/fonts/BeVietNam/BeVietnamPro-Regular.ttf";
import BeVietnamProBold from "../assets/fonts/BeVietNam/BeVietnamPro-Bold.ttf";
import BeVietnamProItalic from "../assets/fonts/BeVietNam/BeVietnamPro-Italic.ttf";
import BeVietnamProBoldItalic from "../assets/fonts/BeVietNam/BeVietnamPro-BoldItalic.ttf";
import {
  Button,
  Flex,
  Tooltip,
  FormControl,
  useDisclosure,
  Spinner,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
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
import { TbFocus2 } from "react-icons/tb";
import { useLocation } from "react-router-dom";
import { FaEllipsisVertical } from "react-icons/fa6";
import {
  ChevronDownIcon,
  Expand,
  Link,
  LockKeyhole,
  Paperclip,
  Share2,
} from "lucide-react";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import { jsPDF } from "jspdf";
import useDrawer from "@/hooks/useDrawer";
import AttachmentsDrawer from "@/components/AttachmentsDrawer";
import { cn } from "./lib/utils";
import useModal from "@/hooks/useModal";
import SharedModal from "@/components/SharedModal";

function EditorContainer({ editorRef }) {
  const currentNote = useApp((state) => state.currentNote);
  const [confirmDeleteNote, setConfirmDelete] = useState(false);
  const [isFullScreen, setFullScreen] = useState(false);
  const { onClose } = useDisclosure();

  const handleCloseConfirm = () => {
    setConfirmDelete(false);
  };

  const { isLoading, actions } = useNotes();
  const [isLoadingExport, setLoadingExport] = useState(false);
  const { updateFavorite } = useFavorite();
  const { createTag, deleteTagInNote, applyTag } = useTags();

  const currentTags = useApp((state) => state.currentTags);
  const setCurrentTags = useApp((state) => state.setCurrentTags);
  const allTags = useApp((state) => state.allTags);
  const setAllTags = useApp((state) => state.setAllTags);

  const location = useLocation();

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
    { path: Montserract, name: "Montserrat", size: "normal" },
    { path: MontserractBold, name: "Montserrat", size: "bold" },
    { path: MontserractItalic, name: "Montserrat", size: "italic" },
    { path: MontserractBoldItalic, name: "Montserrat", size: "bolditalic" },

    { path: Times, name: "times", size: "normal" },
    { path: TimesBold, name: "times", size: "bold" },
    { path: TimesItalic, name: "times", size: "italic" },
    { path: TimesBoldItalic, name: "times", size: "bolditalic" },

    { path: Vollkorn, name: "Vollkorn", size: "normal" },
    { path: VollkornBold, name: "Vollkorn", size: "bold" },
    { path: VollkornItalic, name: "Vollkorn", size: "italic" },
    { path: VollkornBoldItalic, name: "Vollkorn", size: "bolditalic" },

    { path: BeVietnamPro, name: "Be Vietnam Pro", size: "normal" },
    { path: BeVietnamProBold, name: "Be Vietnam Pro", size: "bold" },
    { path: BeVietnamProItalic, name: "Be Vietnam Pro", size: "italic" },
    {
      path: BeVietnamProBoldItalic,
      name: "Be Vietnam Pro",
      size: "bolditalic",
    },

    { path: Courier, name: "Courier New", size: "normal" },
    { path: CourierBold, name: "Courier New", size: "bold" },
    { path: CourierItalic, name: "Courier New", size: "italic" },
    { path: CourierBoldItalic, name: "Courier New", size: "bolditalic" },
  ];

  const handelExportFile = async () => {
    setLoadingExport(true);
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
      const file = new File([blob], "font.ttf", { type: "font/ttf" });
      const base64String = (await convertTTFToBase64(file)) as string;
      doc.addFileToVFS("font.ttf", base64String);
      doc.addFont("font.ttf", font.name, font.size);
    }

    const content = editorRef.current.firstChild;
    console.log(content);
    console.log(doc.getFontList());

    await doc.html(content, {
      async callback(doc) {
        await doc.save(`${currentNote.title}.pdf`);
      },
      autoPaging: "text",
      margin: [20, 0, 20, 16],
      html2canvas: { scale: 0.23 },
    });
    setLoadingExport(false);
  };

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      setFullScreen(false);
    }
    // if (event.key === "f" || event.key === "F") {
    //   if (!window.editor.isFocused) setFullScreen(true);
    // }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  const [drawer, showDrawer] = useDrawer("xs");
  const [modal, showModal] = useModal("xl");

  const handleCopyLink = () => {
    const text = `${import.meta.env.VITE_CLIENT_PATH}/note/${
      currentNote.id
    }/shared/public`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={cn({ "full-screen": isFullScreen })}>
      {drawer}
      {modal}
      {/* BUG: where is the spinner? */}
      {/* FIX: https://stackoverflow.com/questions/73031972/how-to-get-state-from-custom-hooks-to-update-in-parent-component */}
      <Modal isOpen={isLoading} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody display="flex" justifyContent="center" alignItems="center">
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
      <Modal isOpen={isLoadingExport} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={4}
          >
            <Text fontSize="xl" fontWeight="50" color="brand.300">
              Exporting...
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
      <ConfirmModal
        modalTitle="Delete note"
        config={currentNote?.title}
        isOpen={confirmDeleteNote}
        confirmDelete={() => {
          const id = window.note_tree?.focusedNode?.id;
          if (id) {
            window.note_tree.delete(id);
            actions.deleteNote(currentNote.id);
          }
        }}
        close={handleCloseConfirm}
        action={"delete"}
      />
      {currentNote ? (
        <div className="flex justify-between">
          <div className="flex justify-start items-center ml-8"></div>
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
                onClick={async () => {
                  await actions.updateNote();
                  const note = window.note_tree?.get(currentNote.id);
                  if (note)
                    window.note_tree.submit(currentNote.id, currentNote?.title);
                }}
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
            <Tooltip label="Focus note">
              <Button
                isDisabled={
                  currentNote === undefined ||
                  !location.pathname.includes("note")
                }
                variant="ghost"
                style={{
                  height: "40px",
                  width: "40px",
                  padding: "1px",
                  borderRadius: "50%",
                }}
                onClick={() => {
                  window.note_tree?.focus(currentNote.id, { scroll: true });
                }}
              >
                <TbFocus2 size={20} color="var(--brand400)" />
              </Button>
            </Tooltip>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<FaEllipsisVertical size={20} color="var(--brand400)" />}
                variant="unstyled"
              ></MenuButton>
              <MenuList>
                <MenuItem
                  icon={<Expand size={20} color="var(--brand400)" />}
                  onClick={() => setFullScreen(!isFullScreen)}
                >
                  Full screen
                </MenuItem>
                <MenuItem
                  onClick={handelExportFile}
                  icon={<TbFileExport size={21} color="var(--brand400)" />}
                >
                  Export note
                </MenuItem>
                <MenuItem
                  icon={<Share2 size={20} color="var(--brand400)" />}
                  onClick={() =>
                    showModal(
                      `Share "${currentNote.title}"`,
                      (onClose) => {
                        return (
                          <SharedModal
                            actions={actions}
                            noteId={currentNote.id}
                            onClose={onClose}
                          />
                        );
                      },
                      true
                    )
                  }
                >
                  Share
                </MenuItem>
                <MenuItem
                  icon={<Link size={20} color="var(--brand400)" />}
                  onClick={handleCopyLink}
                >
                  Copy link
                </MenuItem>
                <MenuItem
                  icon={<LockKeyhole size={20} color="var(--brand400)" />}
                >
                  Lock note
                </MenuItem>
                <MenuItem
                  icon={<Paperclip size={20} color="var(--brand400)" />}
                  onClick={() => {
                    showDrawer("Attachments", (onClose) => (
                      <AttachmentsDrawer
                        actions={actions}
                        // noteId={currentNote.id}
                      />
                    ));
                  }}
                >
                  Attachments
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Flex
            alignItems="center"
            pos="absolute"
            bottom={0}
            zIndex={3}
            left={0}
            right={0}
            p={2}
          >
            <Tooltip
              shouldWrapChildren={true}
              label="Your note belongs to these tags"
            >
              <IoMdPricetag size={30} color="var(--brand400)" />
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
        </div>
      ) : (
        <Text pl="2em" pr="2em" pt="2em" color="text.inactive">
          <strong>Select</strong> or <strong>Create</strong> a new note to edit
        </Text>
      )}
    </div>
  );
}

export default EditorContainer;
