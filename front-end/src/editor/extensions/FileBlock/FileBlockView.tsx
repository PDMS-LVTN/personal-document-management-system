import { Icon } from "@/editor/components/ui/Icon";
import { Node } from "@tiptap/pm/model";
import { Editor, NodeViewWrapper } from "@tiptap/react";
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
          className="flex justify-start items-center gap-2 bg-orange-50 rounded-xl hover:cursor-pointer p-3"
          onClick={onClick}
        >
          <Icon
            name="ArrowBigDownDash"
            className="w-12 h-12 text-black dark:text-white opacity-20"
          />
          <span>{name}</span>
          <span className="text-gray-400">{formatFileSize(size)}</span>
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
