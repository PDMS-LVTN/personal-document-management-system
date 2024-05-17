import { Note, useApp } from "@/store/useApp";
import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  ModalCloseButton,
  ModalHeader,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { CSSProperties, useState } from "react";
import { NodeApi, TreeApi } from "react-arborist";
import { RxCaretDown, RxCaretRight } from "react-icons/rx";
import { LuPlus } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
import { AiFillFile } from "react-icons/ai";
import { FaFileCirclePlus } from "react-icons/fa6";
import useNotes from "@/hooks/useNotes";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import useModal from "@/hooks/useModal";
import SharedModal from "@/components/SharedModal";

const Node = ({
  node,
  style,
  dragHandle,
  tree,
}: {
  style: CSSProperties;
  node: NodeApi<Note>;
  tree: TreeApi<Note>;
  dragHandle?: (el: HTMLDivElement | null) => void;
}) => {
  const setCurrentNote = useApp((state) => state.setCurrentNote);
  const currentNote = useApp((state) => state.currentNote);
  const setIsMerge = useApp((state) => state.setIsMerge);
  const { isLoading, actions } = useNotes();
  // const [modal, showModal] = useModal("lg");

  const handleInputChange = async (e) => {
    const res = await actions.importNote(node.id, e.target.files[0]);
    res &&
      tree.create({
        type: "internal",
        parentId: node.id + "," + res.id + "," + res.title,
        index: node.childIndex + 1,
      });
  };

  const handleCreateNote = async () => {
    const res = await actions.createNote(node.id);
    tree.create({
      type: "internal",
      parentId: node.id + "," + res.id + "," + res.title,
      index: node.childIndex + 1,
    });
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleShare = () => {
    // showModal(
    //   `Share "${node.data.title}"`,
    //   (onClose) => {
    //     return <SharedModal actions={actions} node={node} onClose={onClose} />;
    //   },
    //   true
    // );
    setIsOpen(true);
  };

  const { onClose } = useDisclosure();

  return (
    <div
      className={`node-container ${node.state.isSelected ? "is-selected" : ""}`}
      style={style}
      ref={dragHandle}
    >
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent pb={5}>
          <ModalHeader>{`Share "${node.data.title}"`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SharedModal
              actions={actions}
              noteId={node.id}
              onClose={() => {
                setIsOpen(false);
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
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
      <div
        className="node-content"
        onClick={async () => {
          node.data.childNotes.length && node.toggle();
        }}
      >
        {!node.data.childNotes.length ? (
          <>
            <span className="arrow" style={{ width: "16px" }}></span>
            <span className="mr-3">
              <AiFillFile color="var(--brand300)" size="20px" />
            </span>
          </>
        ) : (
          <>
            <span className="arrow">
              {node.isOpen ? <RxCaretDown /> : <RxCaretRight />}
            </span>
            <span className="mr-3">
              <FaFileCirclePlus color="var(--brand600)" size="20px" />
            </span>
          </>
        )}
        <span className="node-text">
          {node.isEditing ? (
            <input
              type="text"
              defaultValue={node.data.title}
              onFocus={(e) => e.currentTarget.select()}
              onBlur={() => node.reset()}
              onKeyDown={async (e) => {
                if (e.key === "Escape") node.reset();
                if (e.key === "Enter") {
                  node.submit(e.currentTarget.value);
                  // setCurrentNote({
                  //   ...currentNote,
                  //   title: e.currentTarget.value,
                  // });
                  await actions.updateNote({
                    title: e.currentTarget.value,
                    id: node.id,
                  });
                }
              }}
              autoFocus
            />
          ) : (
            <span className="line-clamp-1">{node.data.title}</span>
          )}
        </span>
      </div>

      <div className="file-actions">
        <Menu>
          <MenuButton
            height="2rem"
            width="2rem"
            padding="7px"
            transition="all 0.2s"
            borderRadius="0.375rem"
            _hover={{ bg: "gray.100" }}
            _expanded={{ bg: "blue.100" }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <BsThreeDots />
          </MenuButton>
          <MenuList>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setIsMerge(true);
                tree.delete(node.id);
              }}
            >
              Merge note
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
                accept=".docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                type="file"
                className="upload-file"
                name="upload_file"
                onChange={handleInputChange}
              />
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                node.edit();
              }}
            >
              Rename
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
            >
              Share
            </MenuItem>
            <MenuDivider />
            <MenuItem
              onClick={async (e) => {
                e.stopPropagation();
                tree.delete(node.id);
                actions.deleteNote(node.id);
              }}
            >
              Delete note
            </MenuItem>
          </MenuList>
        </Menu>
        <Tooltip label="Quickly add a note inside">
          <Button
            variant="ghost"
            height="2rem"
            width="2rem"
            padding="7px"
            transition="all 0.2s"
            minWidth={0}
            _hover={{ bg: "gray.100" }}
            _expanded={{ bg: "blue.100" }}
            onClick={(e) => {
              e.stopPropagation();
              handleCreateNote();
              // tree.create({ type: "internal", parentId: node.id });
            }}
          >
            <LuPlus />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Node;
