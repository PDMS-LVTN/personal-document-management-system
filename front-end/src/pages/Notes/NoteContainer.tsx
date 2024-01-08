import { useEffect, useRef, useState } from "react";
import Notes from "./Notes";
import { useApp } from "../../store/useApp";
import useAxiosJWT from "../../hooks/useAxiosJWT";
import { useToast } from "@chakra-ui/react";
import { useAuthentication } from "../../store/useAuth";
import { MDXEditorMethods } from "@mdxeditor/editor";
import markdown from "../../assets/default-content.md?raw";
import { tempState } from "../../editor/_boilerplate";

const CREATE_NOTE = "note/add_note";
const ALL_NOTE = "note/all_note";

function NoteContainer() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const clean = useApp((state) => state.clean);
  const setCurrentNote = useApp((state) => state.setCurrentNote);
  const axiosJWT = useAxiosJWT();
  const toast = useToast();

  const auth = useAuthentication((state) => state.auth);
  const setAuth = useAuthentication((state) => state.setAuth);

  const ref = useRef<MDXEditorMethods>();
  const currentNote = useApp((state) => state.currentNote);

  const createNote = async (id) => {
    try {
      const response = await axiosJWT.post(
        CREATE_NOTE,
        JSON.stringify({
          user_id: auth.id,
          title: "Untitled",
          content: markdown,
          read_only: false,
          size: 0,
          parent_id: id,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
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
      ref.current?.setMarkdown(markdown);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        setAuth(undefined);
        clean();
      }
    }
  };

  const updateNote = async () => {
    setLoading(true);
    console.log(tempState.waitingImage);
    const processedMarkdown: string = ref.current?.getMarkdown().trim();

    // Create a form data object
    const formData = new FormData();

    // Optional, if you want to use a DTO on your server to grab this data
    formData.append("note_ID", currentNote.id);

    // Append each of the files
    tempState.waitingImage.forEach((file) => {
      formData.append("files[]", file);
    });
    formData.append("content", processedMarkdown);
    formData.append("title", currentNote?.title);

    try {
      const response = await axiosJWT.patch(
        `note/${currentNote.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response);
      toast({
        title: `Your note has been updated. 🙂`,
        status: "success",
        isClosable: true,
      });
      tempState.waitingImage = [];
    } catch (error) {
      console.log(error);
      toast({
        title: `Some error happened! 😢`,
        status: "error",
        isClosable: true,
      });
    }

    setLoading(false);
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

  const clickANoteHandler = async (id) => {
    try {
      const response = await axiosJWT.get(`note/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response.data);
      const noteItem = response.data;
      setCurrentNote({
        title: noteItem?.title,
        id: noteItem?.id,
        content: noteItem?.content,
      });
      ref.current?.setMarkdown(noteItem.content);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Notes
      ref={ref}
      notes={notes}
      handler={{ clickANoteHandler, deleteNote, createNote, updateNote }}
      isLoading={isLoading}
    />
  );
}

export default NoteContainer;
