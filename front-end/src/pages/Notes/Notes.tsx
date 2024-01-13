import {
  Button,
  Flex,
  Skeleton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import ToolsIcon from "../../assets/tools-icon.svg";
import PlusIcon from "../../assets/plus-icon.svg";
import { Suspense, forwardRef } from "react";
import { useApp } from "../../store/useApp";
import { TreeView } from "../../components/TreeView";
import useNotes from "../../hooks/useNotes";

const Notes = ({ editorRef }) => {

  const treeItems = useApp((state) => state.treeItems);
  const { actions } = useNotes(editorRef);

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
            <Button
              style={{
                height: "40px",
                width: "40px",
                padding: "7px",
                borderRadius: "50%",
                background: "var(--brand400)",
              }}
              onClick={() => actions.createNote(null)}
            >
              <img src={PlusIcon} alt="create" />
            </Button>
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
