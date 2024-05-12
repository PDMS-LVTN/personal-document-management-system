import { Fragment } from "react";
import { useApp } from "../store/useApp";
import { Text } from "@chakra-ui/react";
import { BlockEditor } from "./components/BlockEditor";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useParams } from "react-router-dom";

function Editor({ editorRef }) {
  const currentNote = useApp((state) => state.currentNote);
  const { id } = useParams();
  const ydoc = new Y.Doc();

  const websocketProvider = new HocuspocusProvider({
    url: "ws://127.0.0.1:1234",
    name: id || "0",
    document: ydoc,
  });

  if (!currentNote || !currentNote.id)
    return (
      <Text pl="2em" pr="2em" pt="2em" color="text.inactive">
        <strong>Select</strong> or <strong>Create</strong> a new note to edit
      </Text>
    );
  return (
    <Fragment>
      <BlockEditor
        editorRef={editorRef}
        // isEditable={editable}
        ydoc={ydoc}
        provider={websocketProvider}
      />
    </Fragment>
  );
}

export default Editor;
