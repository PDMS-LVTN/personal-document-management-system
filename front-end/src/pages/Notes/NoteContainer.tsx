import { useEffect, useState } from "react";
import Notes from "./Notes";
import useNotes from "../../hooks/useNotes";
import { useOutletContext } from "react-router-dom";
import { ContextType } from "../../layouts/TreeAndEditorContainer";
import { useTags } from "../../hooks/useTags";
import { Note, useApp } from "../../store/useApp";

function NoteContainer() {
  const { ref } = useOutletContext<ContextType>();
  const { isLoading, actions } = useNotes();
  const { getAllTags } = useTags();
  const [notes, setNotes] = useState<Note[]>(null);
  const setAllTags = useApp((state) => state.setAllTags);

  useEffect(() => {
    console.log("note container");
    let isMounted = true;
    const controller = new AbortController();
    const loadData = async () => {
      const notesData: Note[] = await actions.getAllNotes(controller);
      console.log(notesData);
      const { tags } = await getAllTags(controller);
      if (isMounted) {
        setNotes(notesData);
        setAllTags(tags);
      }
    };
    loadData();

    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  }, []);

  if (!notes) return null;

  return (
    <Notes
      editorRef={ref}
      notes={notes}
      actions={actions}
      isLoading={isLoading}
    />
  );
}

export default NoteContainer;
