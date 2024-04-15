import useNotes from "@/hooks/useNotes";
import { Button } from "@chakra-ui/react";
import { Editor, NodeViewWrapper } from "@tiptap/react";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  editor: Editor;
  getPos: () => number;
  node: Node & {
    attrs: {
      id: string;
      label: string;
    };
  };
  updateAttributes: (attrs: Record<string, string>) => void;
}

const LinkView = (props: Props) => {
  const { actions } = useNotes();
  const [label, setLabel] = useState("");
  useEffect(() => {
    const loadData = async () => {
      const responseData = await actions.getANote(props.node.attrs.id);
      setLabel(responseData.title);
    };

    loadData();
  }, []);

  return (
    <NodeViewWrapper as="span">
      <Button
        colorScheme="brand"
        variant="outline"
        size="xs"
        onClick={() => {
          if (window.editor.isEditable)
            actions.clickANoteHandler(props.node.attrs.id);
          else
            window.open(
              `${import.meta.env.VITE_CLIENT_PATH}/note/${props.node.attrs.id}`,
              "_blank"
            );
        }}
        gap={2}
      >
        <FileText size={15} style={{ color: "var(--brand400)" }} />
        <span data-id={props.node.attrs.id}>{label}</span>
      </Button>
    </NodeViewWrapper>
  );
};

export default LinkView;
