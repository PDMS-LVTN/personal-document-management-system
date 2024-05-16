import { BlockEditor } from "@/editor/components/BlockEditor";
import { Input } from "@chakra-ui/input";
import { IconButton } from "@chakra-ui/react";
import { Tag, TagLabel } from "@chakra-ui/tag";
import { Home } from "lucide-react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { EditContext } from "@/context/context";

declare global {
  interface Window {
    documentData;
  }
}

const PublicNote = () => {
  const { data } = useOutletContext();
  console.log(data);
  window.documentData = data;

  const editorRef = useRef();
  const navigate = useNavigate();
  const [editable, setEditable] = useState(true);
  const [ydoc, setYdoc] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (data.share_mode == "view") setEditable(false);
    else setEditable(true);
    const doc = new Y.Doc();
    setYdoc(doc);
    setProvider(
      new HocuspocusProvider({
        url: "ws://127.0.0.1:1234",
        name: data.note_id,
        document: doc,
      })
    );
  }, []);

  if (!ydoc || !provider) return null;

  return (
    <EditContext.Provider value={{ editable, setEditable }}>
      <div className="flex items-center justify-start px-4 h-12">
        <Input
          variant="outline"
          maxWidth="60%"
          value={data.title}
          border={0}
          disabled
        />
        <Tag size="lg" ml="auto" variant="solid" backgroundColor="brand.400">
          <TagLabel fontSize="13px">
            {data.share_mode == "view" ? "Viewer" : "Editor"}
          </TagLabel>
        </Tag>
        <IconButton
          size="sm"
          onClick={() => {
            navigate(`/shared/${data.note_id}`);
          }}
          ml={2}
          backgroundColor="brand.400"
          _hover={{ bg: "brand.500" }}
          aria-label="Home"
          icon={<Home color="white" size={17} />}
        />
      </div>
      <BlockEditor
        editorRef={editorRef}
        className="shared-view"
        ydoc={ydoc}
        provider={provider}
      />
    </EditContext.Provider>
  );
};

export default PublicNote;
