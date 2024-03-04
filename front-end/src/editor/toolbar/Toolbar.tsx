import { MdAttachFile } from "react-icons/md";
import useModal from "../../hooks/useModal";
import InsertImageDialog from "./components/InsertImageDialog";

const Toolbar = ({ editor }) => {
  const [modal, showModal] = useModal();
  return (
    <div className="border border-gray-400 p-4 flex flex-row items-center gap-3">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`${
          editor.isActive("bold") ? "bg-sky-500" : ""
        } border border-gray-200 p-1`}
      >
        bold
      </button>
      <button
        // onClick={() => editor.chain().focus().toggleBold().run()}
        onClick={() => {
          showModal("Insert Image", (onClose) => (
            <InsertImageDialog editor={editor} />
          ));
        }}
        className={`border border-gray-200 p-1`}
      >
        <MdAttachFile size={20} />
      </button>
      {modal}
    </div>
  );
};

export default Toolbar;
