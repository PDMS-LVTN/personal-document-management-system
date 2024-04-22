import { Editor, NodeViewWrapper } from "@tiptap/react";
import { ChangeEvent, useCallback } from "react";
import { useFileUpload, useUploader } from "../ImageUpload/view/hooks";
import { Spinner } from "@/editor/components/ui/Spinner";
import { ArrowUpFromLine } from "lucide-react";

export const FileUploadView = ({
  getPos,
  editor,
}: {
  getPos: () => number;
  editor: Editor;
}) => {
  let fileName, fileSize;
  const onUpload = useCallback(
    (url: string) => {
      if (url) {
        editor
          .chain()
          .setFileBlock({ src: url, name: fileName, size: fileSize })
          .deleteRange({ from: getPos(), to: getPos() })
          .focus()
          .run();
      }
    },
    [getPos, editor]
  );
  const { loading, uploadFile } = useUploader({ onUpload });
  const { handleUploadClick, ref } = useFileUpload();

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        fileName = e.target.files[0].name;
        fileSize = e.target.files[0].size;
        uploadFile(e.target.files[0]);
      }
    },
    [uploadFile]
  );

  return (
    <NodeViewWrapper>
      <div className="p-0 m-0" data-drag-handle>
        <div
          contentEditable={false}
          className="flex justify-start gap-2 rounded-md hover:cursor-pointer  "
          style={{
            backgroundColor: "var(--brand50)",
            width: "40%",
            position: "relative",
            height: "40px",
          }}
          onClick={handleUploadClick}
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
            <ArrowUpFromLine
              className="w-5 h-5 text-black dark:text-white "
              style={{ color: "var(--brand400)" }}
            />
          </div>

          <div
            className="flex items-center gap-3 pl-1 py-1"
            style={{ marginLeft: "50px" }}
          >
            <div className="text-xs line-clamp-1">Upload a file</div>
            {loading && <Spinner className="text-neutral-500" size={1.5} />}
          </div>
        </div>
        <input
          className="w-0 h-0 overflow-hidden opacity-0"
          ref={ref}
          type="file"
          //   accept=".jpg,.jpeg,.png,.webp,.gif"
          onChange={onFileChange}
        />
      </div>
    </NodeViewWrapper>
  );
};

export default FileUploadView;
