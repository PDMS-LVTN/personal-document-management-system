import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BlockEditor } from "./components/BlockEditor";

function Editor({ editorRef }) {
  const { id } = useParams();
  const location = useLocation();
  const [ydoc, setYdoc] = useState(null);
  const [websocketProvider, setProvider] = useState(null);

  useEffect(() => {
    if (location.state?.delete) {
      websocketProvider?.destroy();
      setYdoc(null);
      setProvider(null);
      return;
    }
    if (id) {
      websocketProvider?.destroy();
      const newdoc = new Y.Doc();
      setYdoc(newdoc);
      setProvider(
        new HocuspocusProvider({
          url: "ws://127.0.0.1:1234",
          name: id,
          document: newdoc,
          preserveConnection: false,
        })
      );
    }
  }, [id]);

  if (!ydoc || !websocketProvider) return null;

  return (
    <BlockEditor
      editorRef={editorRef}
      ydoc={ydoc}
      provider={websocketProvider}
    />
  );
}

export default Editor;
