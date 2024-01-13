import { useEffect } from "react";
import Notes from "./Notes";
import useNotes from "../../hooks/useNotes";
import { useOutletContext } from "react-router-dom";
import { ContextType } from "../../layouts/TreeAndEditorContainer";
import { useTags } from "../../hooks/useTags";
import { useApp } from "../../store/useApp";

function NoteContainer() {
  const { ref } = useOutletContext<ContextType>();
  const { actions } = useNotes(ref);
  const { getAllTags } = useTags();
  const setTree = useApp((state) => state.setTree);
  const setAllTags = useApp((state) => state.setAllTags);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const loadData = async () => {
      const notes = await actions.getAllNotes(controller);
      const { tags } = await getAllTags(controller);
      if (isMounted) {
        setTree(notes);
        setAllTags(tags);
      }
    };
    loadData();

    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  }, []);

  return <Notes editorRef={ref} />;
}

export default NoteContainer;
