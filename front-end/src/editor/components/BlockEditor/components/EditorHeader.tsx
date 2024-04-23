import { Icon } from "@/editor/components/ui/Icon";
import { EditorInfo } from "./EditorInfo";
// import { EditorUser } from "../types";
// import { WebSocketStatus } from '@hocuspocus/provider'
import { Toolbar } from "@/editor/components/ui/Toolbar";
import { Spinner } from "@chakra-ui/react";

export type EditorHeaderProps = {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
  characters: number;
  words: number;
  // collabState: WebSocketStatus
  // users: EditorUser[]
  isSaving?: boolean;
};

export const EditorHeader = ({
  characters,
  // collabState,
  // users,
  words,
  isSidebarOpen,
  toggleSidebar,
  isSaving,
}: EditorHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between flex-none py-2 pl-6 pr-3 text-black bg-white border-b border-t border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-800">
      <div className="flex flex-row gap-x-1.5 items-center">
        <div className="flex items-center gap-x-1.5">
          <Toolbar.Button
            tooltip={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            onClick={toggleSidebar}
            active={isSidebarOpen}
            className={isSidebarOpen ? "bg-transparent" : ""}
          >
            <Icon name={isSidebarOpen ? "PanelLeftClose" : "PanelLeft"} />
          </Toolbar.Button>
        </div>
        <div className="text-gray-400">
          {isSaving === undefined ? null : isSaving ? (
            <div className="flex items-center gap-2">
              <Spinner color="gray.400" size="xs" /> <div>Saving...</div>
            </div>
          ) : (
            <div>Saved</div>
          )}
        </div>
      </div>
      {/* <EditorInfo characters={characters} words={words} collabState={collabState} users={users} /> */}
      <EditorInfo characters={characters} words={words} />
    </div>
  );
};
