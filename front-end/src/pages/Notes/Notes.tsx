import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import ToolsIcon from "../../assets/tools-icon.svg";
import PlusIcon from "../../assets/plus-icon.svg";
import { Suspense } from "react";
import { useApp } from "../../store/useApp";
import { TreeView } from "../../components/TreeView";
import useNotes from "../../hooks/useNotes";

const Notes = ({ editorRef }) => {

  const treeItems = useApp((state) => state.treeItems);
  const { actions } = useNotes(editorRef);

  const handleInputChange = (e) => {
    actions.importNote(null, e.target.files[0]);
  };

  return (
    <>
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
          <Menu>
            <MenuButton
              height="40px"
              width="40px"
              padding="12px"
              // transition="all 0.2s"
              borderRadius="50%"
              background="var(--brand400)"
            >
              <img src={PlusIcon} alt="create" />
            </MenuButton>
            <MenuList>
              <MenuItem
                position={"relative"}
                onClick={() => actions.createNote(null)}
              >
                Create new note
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
            </MenuList>
          </Menu>
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
