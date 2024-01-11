import { Fragment, Suspense } from "react";
import { MDXEditor } from "@mdxeditor/editor";
import { ALL_PLUGINS } from "./_boilerplate";
import { useApp } from "../store/useApp";
import { Skeleton, Text } from "@chakra-ui/react";

function Editor({editorRef}) {
  const currentNote = useApp((state) => state.currentNote);

  return (
    <Fragment>
      {/* There is only one editor instance.       */}
      {/* This editor is shared between all notes. */}
      {currentNote && currentNote.content ? (
        <Suspense fallback={<Skeleton />}>
          <MDXEditor
            ref={editorRef}
            markdown={currentNote.content}
            // onChange={() => {}}
            plugins={ALL_PLUGINS}
            contentEditableClassName="prose prose-lg inside-editor max-w-full"
          />
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
