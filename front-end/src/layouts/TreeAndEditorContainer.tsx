import { GridItem } from "@chakra-ui/react";
import { Fragment, useEffect } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import EditorContainer from "../editor/EditorContainer";
// import { MDXEditorMethods } from "@mdxeditor/editor";
export type ContextType = { ref: any | null };

function TreeAndEditorContainer() {
  const { ref } = useOutletContext<ContextType>();

  useEffect(() => {
    const column = document.getElementById("structure-grid-item");
    const searchBox = document.getElementById("search-box-grid-item");
    const resizer = document.createElement("div");
    resizer.classList.add("resizer");

    // Set the height
    resizer.style.height = `${column.offsetHeight}px`;

    // Add a resizer element to the column
    column.appendChild(resizer);

    // Track the current position of mouse
    let x = 0;
    let w = 0;

    const mouseDownHandler = function (e) {
      // Get the current mouse position
      x = e.clientX;

      // Calculate the current width of column
      const styles = window.getComputedStyle(column);
      w = parseInt(styles.width, 10);

      // Attach listeners for document's events
      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
      // Determine how far the mouse has been moved
      const dx = e.clientX - x;

      // Update the width of column
      column.style.width = `${w + dx}px`;
      searchBox.style.width = `${w + dx}px`;
    };

    resizer.addEventListener("mousedown", mouseDownHandler);
    const mouseUpHandler = function () {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };
    return () => {
      resizer.removeEventListener("mousedown", mouseDownHandler);
    };
  }, []);

  return (
    <Fragment>
      <GridItem
        id="structure-grid-item"
        rowSpan={1}
        colSpan={2}
        bg="#FAF9FE"
        pos="relative"
        pt="1em"
        overflowY="hidden"
      >
        <Outlet context={{ ref }} />
      </GridItem>
      <GridItem
        id="editor-grid-item"
        rowSpan={1}
        colSpan={7}
        bg="white"
        overflow="hidden"
        pos="relative"
      >
        <EditorContainer editorRef={ref} />
      </GridItem>
    </Fragment>
  );
}

export default TreeAndEditorContainer;
