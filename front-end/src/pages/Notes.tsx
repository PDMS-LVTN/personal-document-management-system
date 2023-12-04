import {
  Button,
  Flex,
  GridItem,
  Skeleton,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import markdown from "../assets/default-content.md?raw";
import { ALL_PLUGINS } from "../editor/_boilerplate";
import { MDXEditor, MDXEditorMethods } from "@mdxeditor/editor";
import ToolsIcon from "../assets/tools-icon.svg";
import PlusIcon from "../assets/plus-icon.svg";
import DownCaret from "../assets/down-caret.svg";
import BlackPlusIcon from "../assets/black-plus-icon.svg";
import BlackOptionsIcon from "../assets/black-options-icon.svg";
import BlackDotIcon from "../assets/black-dot-icon.svg";
import TrashCanIcon from "../assets/trashcan-icon.svg";
import PinIcon from "../assets/pin-icon.svg";
import { useEffect, useRef, useState, Suspense } from "react";
import { useAuthentication } from "../store/useAuth";

import useAxiosJWT from "../hooks/useAxiosJWT";
import { useApp } from "../store/useApp";

const CREATE_NOTE = "note/add_note";
const ALL_NOTE = "note/all_note";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const currentNote = useApp((state) => state.currentNote);
  const clean = useApp((state) => state.clean);
  const setCurrentNote = useApp((state) => state.setCurrentNote);
  const axiosJWT = useAxiosJWT();
  const toast = useToast();

  const auth = useAuthentication((state) => state.auth);
  const setAuth = useAuthentication((state) => state.setAuth);

  const ref = useRef<MDXEditorMethods>();

  const createNote = async () => {
    try {
      const response = await axiosJWT.post(
        CREATE_NOTE,
        JSON.stringify({
          user_id: auth.id,
          title: "Untitled",
          content: markdown,
          read_only: false,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      // ref.current?.setMarkdown(markdown);
      setNotes(
        // Replace the state
        [
          // with a new array
          ...notes, // that contains all the old items
          // and one new item at the end
          response.data,
        ]
      );
      const currentNote = {
        id: response.data.id,
        title: response.data.title,
        content: response.data.content,
      };
      setCurrentNote(currentNote);
    } catch (error) {
      if (error.response?.status === 403) {
        setAuth(undefined);
        clean();
      }
    }
  };

  const updateNote = async () => {
    try {
      const processedMarkdown: string = ref.current?.getMarkdown().trim();
      console.log(processedMarkdown);
      const response = await axiosJWT.patch(
        `note/${currentNote.id}`,
        JSON.stringify({
          content: processedMarkdown,
          title: currentNote?.title,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      setNotes(
        notes.map((note, i) => {
          if (note.id === currentNote.id) {
            return { ...currentNote, content: processedMarkdown };
          } else {
            // The rest haven't changed
            return note;
          }
        })
      );
      toast({
        title: `Your note has been updated.`,
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      if (error.response?.status === 403) {
        setAuth(undefined);
        clean();
      }
    }
  };

  const deleteNote = async () => {
    try {
      const response = await axiosJWT.delete(`note/${currentNote.id}`, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response.data);
      setNotes(notes.filter((note) => note.id !== currentNote.id));
      setCurrentNote(undefined);
      toast({
        title: `Your note has been deleted.`,
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      if (error.response?.status === 403) {
        setAuth(undefined);
        clean();
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getAllNotes = async () => {
      try {
        const response = await axiosJWT.post(
          ALL_NOTE,
          JSON.stringify({ user_id: auth.id }),
          {
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
          }
        );
        console.log(response.data);
        isMounted && setNotes(response.data);
      } catch (error) {
        if (error.response?.status === 403) setAuth(undefined);
      }
    };
    getAllNotes();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <>
      <GridItem
        id="notes"
        rowSpan={1}
        colSpan={3}
        bg="#FAF9FE"
        pos="relative"
        pt="1em"
      >
        <Flex justify="space-between" mb="1em" pl="2em" pr="2em">
          <Text fontSize="2xl" fontWeight="600">
            Notes
          </Text>
          <div>
            <Button
              variant="ghost"
              mr="0.5em"
              style={{
                height: "40px",
                width: "40px",
                padding: "7px",
                borderRadius: "50%",
              }}
            >
              <img src={ToolsIcon} alt="tools" />
            </Button>
            <Tooltip label="Add">
              <Button
                style={{
                  height: "40px",
                  width: "40px",
                  padding: "7px",
                  borderRadius: "50%",
                  background: "var(--brand400)",
                }}
                onClick={createNote}
              >
                <img src={PlusIcon} alt="create" />
              </Button>
            </Tooltip>
          </div>
        </Flex>
        {notes.length > 0 ? (
          notes.map((noteItem) => {
            return (
              <Suspense fallback={<Skeleton />}>
                <Flex
                  key={noteItem?.id}
                  justify="space-between"
                  bgColor={currentNote?.id === noteItem?.id ? "brand.50" : ""}
                  className="note"
                  pl="2em"
                  pr="2em"
                  onClick={() =>
                    setCurrentNote({
                      title: noteItem?.title,
                      id: noteItem?.id,
                      content: noteItem?.content,
                    })
                  }
                >
                  <Flex alignItems="center">
                    <Button
                      variant="ghost"
                      mr="0.5em"
                      style={{
                        height: "40px",
                        width: "40px",
                        padding: "7px",
                        borderRadius: "50%",
                      }}
                    >
                      <img src={DownCaret} alt="down-caret" />
                    </Button>
                    <Button ml="-1em" variant="ghost">
                      {noteItem?.title}
                    </Button>
                  </Flex>
                  <div>
                    <Button
                      variant="ghost"
                      mr="0.5em"
                      style={{
                        height: "40px",
                        width: "40px",
                        padding: "7px",
                        borderRadius: "50%",
                      }}
                    >
                      <img src={BlackOptionsIcon} alt="options" />
                    </Button>
                    <Button
                      variant="ghost"
                      style={{
                        height: "40px",
                        width: "40px",
                        padding: "7px",
                        borderRadius: "50%",
                      }}
                    >
                      <img src={BlackPlusIcon} alt="plus icon" />
                    </Button>
                  </div>
                </Flex>
              </Suspense>
            );
          })
        ) : (
          <Text pl="2em" pr="2em" color="text.inactive">
            Click <strong>Add</strong> to create a new note
          </Text>
        )}
      </GridItem>
      <GridItem
        id="editor"
        rowSpan={1}
        colSpan={6}
        bg="white"
        sx={{ overflowY: "scroll" }}
      >
        <Flex justifyContent="right">
          <Tooltip label="Delete note">
            <Button
              isDisabled={currentNote === undefined}
              variant="ghost"
              style={{
                height: "40px",
                width: "40px",
                padding: "7px",
                borderRadius: "50%",
              }}
              onClick={deleteNote}
            >
              <img src={TrashCanIcon} alt="delete-note" />
            </Button>
          </Tooltip>
          <Tooltip label="Save note">
            <Button
              isDisabled={currentNote === undefined}
              variant="ghost"
              style={{
                height: "40px",
                width: "40px",
                padding: "7px",
                borderRadius: "50%",
              }}
              onClick={updateNote}
            >
              <img src={PinIcon} alt="save-note" />
            </Button>
          </Tooltip>
        </Flex>
        {/* There is only one editor instance.       */}
        {/* This editor is shared between all notes. */}
        {currentNote ? (
          <Suspense fallback={<Skeleton />}>
            <MDXEditor
              ref={ref}
              markdown={currentNote.content}
              // onChange={() => {}}
              plugins={ALL_PLUGINS}
              contentEditableClassName="prose prose-lg inside-editor max-w-full"
            />
          </Suspense>
        ) : (
          <Text pl="2em" pr="2em" color="text.inactive">
            <strong>Select</strong> or <strong>Create</strong> a new note to
            edit
          </Text>
        )}
      </GridItem>
    </>
  );
};

export default Notes;
