import { Editor, NodeViewWrapper } from "@tiptap/react";
import { ChangeEvent, useCallback } from "react";
import { Icon } from "@/editor/components/ui/Icon";
import { useFileUpload, useUploader } from "../ImageUpload/view/hooks";
import { Spinner } from "@/editor/components/ui/Spinner";

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

  //   if (loading) {
  //     return (
  //       <div className="flex items-center justify-center p-8 rounded-lg min-h-[10rem] bg-opacity-80">

  //       </div>
  //     );
  //   }

  return (
    <NodeViewWrapper>
      <div className="p-0 m-0" data-drag-handle>
        <div
          contentEditable={false}
          className="flex justify-start items-center gap-2 bg-orange-50 rounded-xl hover:cursor-pointer p-3"
          onClick={handleUploadClick}
        >
          <Icon
            name="Upload"
            className="w-12 h-12  text-black dark:text-white opacity-20"
          />
          <span>Upload a file</span>
          {loading && <Spinner className="text-neutral-500" size={1.5} />}
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
