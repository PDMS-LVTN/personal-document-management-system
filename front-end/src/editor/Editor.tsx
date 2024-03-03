import { Fragment, Suspense } from "react";
import { MdAttachFile } from "react-icons/md";
// import { MDXEditor } from "@mdxeditor/editor";
// import { ALL_PLUGINS } from "./_boilerplate";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useApp } from "../store/useApp";
import { Skeleton, Text } from "@chakra-ui/react";
import { CustomImage } from "./extension-image/image";

const Tiptap = ({ editorRef }) => {
  const extensions = [
    CustomImage,
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
    }),
  ];

  const content = `<p>
  this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>`;

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "border border-gray-400 p-4 inside-editor",
      },
    },
    extensions,
    content,
  });
  if (!editor) return null;
  editorRef.current = editor;

  return (
    <>
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
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`border border-gray-200 p-1`}
        >
          <MdAttachFile size={20} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </>
  );
};

function Editor({ editorRef }) {
  const currentNote = useApp((state) => state.currentNote);

  return (
    <Fragment>
      {/* There is only one editor instance.       */}
      {/* This editor is shared between all notes. */}
      {currentNote && currentNote.content ? (
        <Suspense fallback={<Skeleton />}>
          {/* <MDXEditor
            ref={editorRef}
            markdown={currentNote.content}
            // onChange={() => {}}
            plugins={ALL_PLUGINS}
            contentEditableClassName="prose prose-lg inside-editor max-w-full"
          /> */}
          <Tiptap editorRef={editorRef} />
        </Suspense>
      ) : (
        <Text pl="2em" pr="2em" color="text.inactive">
          <strong>Select</strong> or <strong>Create</strong> a new note to edit
        </Text>
      )}
    </Fragment>
  );
}

export default Editor;
