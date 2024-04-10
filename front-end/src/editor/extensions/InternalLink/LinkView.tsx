import useNotes from "@/hooks/useNotes";
import { Button } from "@chakra-ui/react";
import { Editor, NodeViewWrapper } from "@tiptap/react";
import { FileText } from "lucide-react";

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

  return (
    <NodeViewWrapper as="span">
      <Button
        colorScheme="brand"
        variant="outline"
        size="xs"
        onClick={() => {
          actions.clickANoteHandler(props.node.attrs.id);
        }}
        gap={2}
      >
        <FileText size={15} style={{ color: "var(--brand400)" }} />
        <span data-id={props.node.attrs.id}>{props.node.attrs.label}</span>
      </Button>
    </NodeViewWrapper>
  );
};

export default LinkView;
