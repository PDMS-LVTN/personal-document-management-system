import { Icon } from "@/editor/components/ui/Icon";
import { Node } from "@tiptap/pm/model";
import { Editor, NodeViewWrapper } from "@tiptap/react";
import { FileText } from "lucide-react";
import { useCallback, useRef } from "react";

interface FileBlockViewProps {
  editor: Editor;
  getPos: () => number;
  node: Node & {
    attrs: {
      src: string;
      name: string;
      size;
    };
  };
  updateAttributes: (attrs: Record<string, string>) => void;
}

export const FileBlockView = (props: FileBlockViewProps) => {
  const { editor, getPos, node } = props;
  const fileWrapperRef = useRef<HTMLDivElement>(null);
  const { src, name, size } = node.attrs;

  const onClick = useCallback(() => {
    editor.commands.setNodeSelection(getPos());
    document.getElementById("file-node").click();
  }, [getPos, editor.commands]);

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
    else return (bytes / 1073741824).toFixed(2) + " GB";
  }

  const ref = useRef(null);

  return (
    <NodeViewWrapper>
      <div>
        <div
          contentEditable={false}
          ref={fileWrapperRef}
          className="flex justify-start gap-2 rounded-md hover:cursor-pointer  "
          style={{
            backgroundColor: "var(--brand50)",
            width: "40%",
            position: "relative",
            height: "40px",
          }}
          onClick={onClick}
        >
          <div
            style={{
              backgroundColor: "var(--brand100)",
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: "40px",
              borderTopLeftRadius: "0.375rem",
              borderBottomLeftRadius: "0.375rem",
            }}
            className="flex justify-center items-center"
          >
            <FileText
              className="w-5 h-5 text-black dark:text-white "
              style={{ color: "var(--brand400)" }}
            />
          </div>
          <div
            className="flex flex-col justify-center pl-1 py-1"
            style={{ marginLeft: "50px" }}
          >
            <div className="text-xs line-clamp-1">{name}</div>
            <div className="text-gray-400" style={{ fontSize: "10px" }}>
              {formatFileSize(size)}
            </div>
          </div>
        </div>
        <a
          id="file-node"
          className="w-0 h-0 overflow-hidden opacity-0"
          href={`${src}`}
          ref={ref}
        ></a>
      </div>
    </NodeViewWrapper>
  );
};

export default FileBlockView;
