import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { BlockEditor } from "./components/BlockEditor";
import { useApp } from "@/store/useApp";

function Editor({ editorRef }) {
  const { id } = useParams();
  const location = useLocation();
  const currentNote = useApp((state) => state.currentNote);
  const [ydoc, setYdoc] = useState(null);
  const [websocketProvider, setProvider] = useState(null);
  const providerRef = useRef(null);
  const searchTerm = id && {
    keyword: location.state?.data?.keyword,
    images: location.state?.optional?.matchedImages,
  };

  useEffect(() => {
    if (location.state?.delete) {
      providerRef.current?.destroy();
      setYdoc(null);
      setProvider(null);
      providerRef.current = null;
      return;
    }
    if (id || currentNote?.id) {
      providerRef.current?.destroy();
      const newdoc = new Y.Doc();
      setYdoc(newdoc);
      providerRef.current = new HocuspocusProvider({
        url: "ws://127.0.0.1:1234",
        name: id || currentNote.id,
        document: newdoc,
        preserveConnection: false,
      });
      setProvider(providerRef.current);
    }
  }, [id, location]);

  useEffect(() => {
    return () => {
      providerRef.current?.destroy();
    };
  }, []);

  if (!ydoc || !websocketProvider) return null;

  return (
    <BlockEditor
      editorRef={editorRef}
      ydoc={ydoc}
      searchTerm={searchTerm}
      className={currentNote?.shared && "shared"}
      provider={websocketProvider}
    />
  );
}

export default Editor;
