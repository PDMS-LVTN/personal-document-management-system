import { Fragment } from "react";
// import { MDXEditor } from "@mdxeditor/editor";
// import { ALL_PLUGINS } from "./_boilerplate";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
import { useApp } from "../store/useApp";
import { Text } from "@chakra-ui/react";
// import { CustomImage } from "./extension-image/image";
// import Toolbar from "./toolbar/Toolbar";
import { BlockEditor } from "./components/BlockEditor";

// const Tiptap = ({ editorRef }) => {
//   const extensions = [
//     CustomImage,
//     StarterKit.configure({
//       bulletList: {
//         keepMarks: true,
//         keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
//       },
//       orderedList: {
//         keepMarks: true,
//         keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
//       },
//     }),
//   ];

//   const content = `<p>
//   this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
// </p>`;

//   const editor = useEditor({
//     editorProps: {
//       attributes: {
//         class: "border border-gray-400 p-4 inside-editor",
//       },
//     },
//     extensions,
//     content,
//   });
//   if (!editor) return null;
//   editorRef.current = editor;

//   return (
//     <>
//       <Toolbar editor={editor} />
//       <EditorContent editor={editor} />
//     </>
//   );
// };

function Editor({ editorRef }) {
  const currentNote = useApp((state) => state.currentNote);

  if (!currentNote)
    return (
      <Text pl="2em" pr="2em" pt="2em" color="text.inactive">
        <strong>Select</strong> or <strong>Create</strong> a new note to edit
      </Text>
    );
  return (
    <Fragment>
      <BlockEditor editorRef={editorRef} isEditable={true} />
    </Fragment>
  );
}

export default Editor;
