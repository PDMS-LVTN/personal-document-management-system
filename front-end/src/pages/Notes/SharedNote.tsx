import { BlockEditor } from "@/editor/components/BlockEditor";
import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Tag, TagLabel } from "@chakra-ui/tag";
import { Home } from "lucide-react";
// import useNotes from "@/hooks/useNotes";
import { useRef } from "react";
import { useNavigate, useOutletContext } from "react-router";

declare global {
  interface Window {
    documentData;
  }
}

const SharedNote = () => {
  const { data } = useOutletContext();
  console.log(data);
  window.documentData = data;

  const editorRef = useRef();

  // const { actions } = useNotes();

  // useEffect(() => {
  //   // TODO: fetch note
  //   // actions.clickANoteHandler(noteId);
  //   if (window.editor) {
  //     window.editor.commands.setContent(data[0].note.content);
  //     window.editor.setOptions({ editable: false });
  //   }
  // }, []);
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center justify-start px-4 h-12">
        <Input
          variant="outline"
          maxWidth="60%"
          value={data[0].note.title}
          border={0}
          disabled
        />
        <Tag
          size={"lg"}
          ml="auto"
          borderRadius="full"
          variant="solid"
          colorScheme="brand"
        >
          <TagLabel>Viewer</TagLabel>
        </Tag>
        <Button
          onClick={() => {
            navigate("/notes", { replace: true });
          }}
          style={{
            marginLeft: "10px",
            height: "40px",
            width: "40px",
            padding: "11px",
            background: "var(--brand400)",
            borderRadius: "50%",
          }}
        >
          <Home color="white" />
        </Button>
      </div>
      <BlockEditor
        editorRef={editorRef}
        initialContent={data[0].note.content}
        isEditable={false}
        className="shared-view"
      />
    </>
  );
};

export default SharedNote;
