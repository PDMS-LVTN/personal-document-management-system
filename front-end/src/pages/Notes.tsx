import { GridItem } from "@chakra-ui/react";
import markdown from "../assets/demo-contents.md?raw";
import { ALL_PLUGINS } from "../editor/_boilerplate";
import { MDXEditor } from "@mdxeditor/editor";
const Notes = () => {
  return (
    <>
      <GridItem id="notes" rowSpan={1} colSpan={3} bg="#FAF9FE"></GridItem>
      <GridItem
        id="editor"
        rowSpan={1}
        colSpan={6}
        bg="white"
        sx={{ overflowY: "scroll" }}
      >
        <MDXEditor
          markdown={markdown}
          onChange={(md) => console.log("change", { md })}
          plugins={ALL_PLUGINS}
          contentEditableClassName="prose prose-lg inside-editor max-w-full"
        />
      </GridItem>
    </>
  );
};

export default Notes;
