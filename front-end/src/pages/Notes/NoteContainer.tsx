import { useEffect } from "react";
import Notes from "./Notes";
import useNotes from "../../hooks/useNotes";
import { useOutletContext } from "react-router-dom";
import { ContextType } from "../../layouts/TreeAndEditorContainer";

function NoteContainer() {
  const { ref } = useOutletContext<ContextType>();
  const { actions } = useNotes(ref);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    actions.getAllNotes(controller, isMounted);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return <Notes editorRef={ref} />;
}

export default NoteContainer;
