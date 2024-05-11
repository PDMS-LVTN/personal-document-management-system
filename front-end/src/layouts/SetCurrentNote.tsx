import useNotes from "@/hooks/useNotes";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";

export const SetCurrentNote = () => {
  const { id } = useParams();
  const location = useLocation();
  const [isResetted, setIsResetted] = useState(false);
  const { actions } = useNotes();
  useEffect(() => {
    const getCurrentNote = async () => {
      const noteItem = await actions.getANote(id);
      actions.setCurrentNoteHandler(noteItem);
      setIsResetted(true);
    };
    if (id) {
      getCurrentNote();
    }
  }, [location]);
  if (id && !isResetted) return null;
  return <Outlet />;
};
