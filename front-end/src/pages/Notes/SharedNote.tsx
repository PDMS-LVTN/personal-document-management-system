import { BlockEditor } from "@/editor/components/BlockEditor";
import { Input } from "@chakra-ui/input";
import { IconButton } from "@chakra-ui/react";
import { Tag, TagLabel } from "@chakra-ui/tag";
import { Home } from "lucide-react";
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
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-start px-4 h-12">
        <Input
          variant="outline"
          maxWidth="60%"
          value={data.title}
          border={0}
          disabled
        />
        <Tag size="lg" ml="auto" variant="solid" backgroundColor="brand.400">
          <TagLabel>Viewer</TagLabel>
        </Tag>
        <IconButton
          size="sm"
          onClick={() => {
            navigate("/notes", { replace: true });
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
        initialContent={data.content}
        isEditable={false}
        className="shared-view"
      />
    </>
  );
};

export default SharedNote;
