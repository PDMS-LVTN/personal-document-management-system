import { Spinner } from "@/editor/components/ui/Spinner";
import { useDropZone, useFileUpload, useUploader } from "./hooks";
import { Button } from "@/editor/components/ui/Button";
import { Icon } from "@/editor/components/ui/Icon";
import { cn } from "@/editor/lib/utils";
import { ChangeEvent, useCallback } from "react";
import useModal from "@/hooks/useModal";
import { UnsplashDialog } from "../../../components/ui/Dialogs";

export const ImageUploader = ({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) => {
  const { loading, uploadFile } = useUploader({ onUpload });
  const { handleUploadClick, ref } = useFileUpload();
  const { draggedInside, onDrop, onDragEnter, onDragLeave } = useDropZone({
    uploader: uploadFile,
  });
  const [modal, showModal] = useModal("xl");

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      e.target.files ? uploadFile(e.target.files[0]) : null,
    [uploadFile]
  );

  const handleUnsplash = () => {
    showModal("Unsplash Image", (_) => <UnsplashDialog onUpload={onUpload} />);
  };

  const handleGoogleImage = () => {};

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 rounded-lg min-h-[10rem] bg-opacity-80">
        <Spinner className="text-neutral-500" size={1.5} />
      </div>
    );
  }

  const wrapperClass = cn(
    "flex flex-col items-center justify-center px-8 py-10 rounded-lg bg-opacity-80",
    draggedInside && "bg-neutral-100"
  );

  return (
    <div
      className={wrapperClass}
      onDrop={onDrop}
      onDragOver={onDragEnter}
      onDragLeave={onDragLeave}
      contentEditable={false}
    >
      <Icon
        name="Image"
        className="w-12 h-12 mb-4 text-black dark:text-white opacity-20"
      />
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="text-sm font-medium text-center text-neutral-400 dark:text-neutral-500">
          {draggedInside ? "Drop image here" : "Drag and drop or"}
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Button
            disabled={draggedInside}
            onClick={handleUploadClick}
            variant="primary"
            buttonSize="small"
            style={{ width: "100%" }}
          >
            <Icon name="Upload" />
            Upload an image
          </Button>
          <Button
            disabled={draggedInside}
            onClick={handleUnsplash}
            variant="primary"
            buttonSize="small"
          >
            Unsplash
          </Button>
          <Button
            disabled={draggedInside}
            onClick={handleGoogleImage}
            variant="primary"
            buttonSize="small"
          >
            Google Image
          </Button>
        </div>
      </div>
      <input
        className="w-0 h-0 overflow-hidden opacity-0"
        ref={ref}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif"
        onChange={onFileChange}
      />
      {modal}
    </div>
  );
};

export default ImageUploader;
