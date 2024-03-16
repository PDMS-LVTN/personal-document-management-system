import { Note } from "@/store/useApp";
import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { CSSProperties } from "react";
import { NodeApi, TreeApi } from "react-arborist";
import { RxCaretDown, RxCaretRight } from "react-icons/rx";
import { LuPlus } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
import { AiFillFile } from "react-icons/ai";
import { FaFileCirclePlus } from "react-icons/fa6";
import useNotes from "@/hooks/useNotes";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";

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
  //   const CustomIcon = node.data.icon;
  //   const iconColor = node.data.iconColor;
  // node.handleClick = () => {
  //   console.log("click");
  //   node.select();
  // };
  const { isLoading, actions } = useNotes();

  const handleInputChange = async (e) => {
    await actions.importNote(node.id, e.target.files[0]);
    tree.create({
      type: "internal",
      parentId: node.id,
      index: node.childIndex + 1,
    });
  };

  const handleCreateNote = async () => {
    await actions.createNote(node.id);
    tree.create({
      type: "internal",
      parentId: node.id,
      index: node.childIndex + 1,
    });
  };

  const { onClose } = useDisclosure();

  return (
    <div
      className={`node-container ${node.state.isSelected ? "is-selected" : ""}`}
      style={style}
      ref={dragHandle}
    >
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
              Importing...
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
            <span className="arrow"></span>
            <span className="mr-5">
              <AiFillFile color="#6bc7f6" size="24px" />
            </span>
          </>
        ) : (
          <>
            <span className="arrow">
              {node.isOpen ? <RxCaretDown /> : <RxCaretRight />}
            </span>
            <span className="mr-5">
              <FaFileCirclePlus color="#f6cf60" size="24px" />
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
              onKeyDown={(e) => {
                if (e.key === "Escape") node.reset();
                if (e.key === "Enter") node.submit(e.currentTarget.value);
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
            <MenuItem>Move note</MenuItem>
            <MenuItem>Merge note</MenuItem>
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
            {/* <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                node.edit();
              }}
            >
              Rename Note
            </MenuItem> */}
            <MenuItem>Share</MenuItem>
            <MenuDivider />
            <MenuItem
              onClick={async (e) => {
                e.stopPropagation();
                tree.delete(node.id);
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