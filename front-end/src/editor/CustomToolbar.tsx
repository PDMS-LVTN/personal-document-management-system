import {
  UndoRedo,
  Separator,
  BoldItalicUnderlineToggles,
  DiffSourceToggleWrapper,
  ChangeCodeMirrorLanguage,
  ConditionalContents,
  InsertCodeBlock,
  CodeToggle,
  ListsToggle,
  ChangeAdmonitionType,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertAdmonition,
  InsertFrontmatter,
  InsertThematicBreak,
  EditorInFocus,
} from "@mdxeditor/editor";

function whenInAdmonition(editorInFocus: EditorInFocus | null) {
  const node = editorInFocus?.rootNode;
  if (!node || node.getType() !== "directive") {
    return false;
  }

  return ["note", "tip", "danger", "info", "caution"].includes(
    node.getMdastNode().name
  );
}

export const CustomToolbar: React.FC = () => {
  return (
    <DiffSourceToggleWrapper>
      <ConditionalContents
        options={[
          {
            when: (editor) => editor?.editorType === "codeblock",
            contents: () => <ChangeCodeMirrorLanguage />,
          },
          {
            fallback: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />
                <ListsToggle />
                <Separator />

                <ConditionalContents
                  options={[
                    {
                      when: whenInAdmonition,
                      contents: () => <ChangeAdmonitionType />,
                    },
                    { fallback: () => <BlockTypeSelect /> },
                  ]}
                />

                <Separator />

                <CreateLink />
                <InsertImage />

                <Separator />

                <InsertTable />
                <InsertThematicBreak />

                <Separator />
                <InsertCodeBlock />

                <ConditionalContents
                  options={[
                    {
                      when: (editorInFocus) => !whenInAdmonition(editorInFocus),
                      contents: () => (
                        <>
                          <Separator />
                          <InsertAdmonition />
                        </>
                      ),
                    },
                  ]}
                />

                <Separator />
                <InsertFrontmatter />
              </>
            ),
          },
        ]}
      />
    </DiffSourceToggleWrapper>
  );
};
