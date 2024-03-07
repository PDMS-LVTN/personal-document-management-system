// import { WebSocketStatus } from "@hocuspocus/provider";
import { EditorContent, PureEditorContent } from "@tiptap/react";
import React, { useMemo, useRef } from "react";

import { LinkMenu } from "@/editor/components/menus";

import { useBlockEditor } from "@/editor/hooks/useBlockEditor";

import "@/editor/styles/index.css";

import { Sidebar } from "@/editor/components/Sidebar";
// import { Loader } from "@/editor/components/ui/Loader";
// import { EditorContext } from '@/editor/context/EditorContext'
import ImageBlockMenu from "@/editor/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/editor/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/editor/extensions/Table/menus";
// import { useAIState } from '@/editor/hooks/useAIState'
// import { createPortal } from "react-dom";
// import { TiptapProps } from "./types";
import { EditorHeader } from "./components/EditorHeader";
import { TextMenu } from "../menus/TextMenu";
import { ContentItemMenu } from "../menus/ContentItemMenu";

// export const BlockEditor = ({ aiToken, ydoc, provider }: TiptapProps) => {
export const BlockEditor = ({ editorRef }) => {
  // const aiState = useAIState()
  const menuContainerRef = useRef(null);
  // const editorRef = useRef<PureEditorContent | null>(null);

  // const { editor, users, characterCount, collabState, leftSidebar } = useBlockEditor({ aiToken, ydoc, provider })
  const { editor, leftSidebar } = useBlockEditor();

  // const displayedUsers = users.slice(0, 3)

  // const providerValue = useMemo(() => {
  //   return {
  //     isAiLoading: aiState.isAiLoading,
  //     aiError: aiState.aiError,
  //     setIsAiLoading: aiState.setIsAiLoading,
  //     setAiError: aiState.setAiError,
  //   }
  // }, [aiState])

  if (!editor) {
    return null;
  }

  // const aiLoaderPortal = createPortal(<Loader label="AI is now doing its job." />, document.body)

  return (
    // <EditorContext.Provider value={providerValue}>
    <div className="flex h-full" ref={menuContainerRef}>
      <Sidebar
        isOpen={leftSidebar.isOpen}
        onClose={leftSidebar.close}
        editor={editor}
      />
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorHeader
          // characters={characterCount.characters()}
          // collabState={collabState}
          // users={displayedUsers}
          // words={characterCount.words()}
          isSidebarOpen={leftSidebar.isOpen}
          toggleSidebar={leftSidebar.toggle}
        />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
        <EditorContent
          editor={editor}
          ref={editorRef}
          // className="flex-1 overflow-y-auto inside-editor"
          className="inside-editor"
        />
        {/* <ContentItemMenu editor={editor} /> */}
      </div>
    </div>
    //  {aiState.isAiLoading && aiLoaderPortal}
    // </EditorContext.Provider>
  );
};

export default BlockEditor;
