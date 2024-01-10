import { GridItem } from "@chakra-ui/react";
import { Fragment, useRef } from "react";
import { Outlet } from "react-router-dom";
import EditorContainer from "../editor/EditorContainer";
import { MDXEditorMethods } from "@mdxeditor/editor";
export type ContextType = { ref: MDXEditorMethods | null };
function TreeAndEditorContainer() {
  const ref = useRef<MDXEditorMethods>();

  return (
    <Fragment>
      <GridItem
        id="structure-grid-item"
        rowSpan={1}
        colSpan={3}
        bg="#FAF9FE"
        pos="relative"
        pt="1em"
        overflowY="auto"
      >
        <Outlet context={{ ref }} />
      </GridItem>
      <GridItem
        id="editor-grid-item"
        rowSpan={1}
        colSpan={6}
        bg="white"
        sx={{ overflowY: "scroll" }}
      >
        <EditorContainer editorRef={ref} />
      </GridItem>
    </Fragment>
  );
}

export default TreeAndEditorContainer;
