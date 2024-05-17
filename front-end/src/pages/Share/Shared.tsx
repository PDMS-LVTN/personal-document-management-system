import { EditContext } from "@/context/context";
import { usePermission } from "@/hooks/usePermission";
import { useApp } from "@/store/useApp";
import { useAuthentication } from "@/store/useAuth";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

export const Shared = () => {
  const { id } = useParams();
  const currentNote = useApp((state) => state.currentNote);
  const auth = useAuthentication((state) => state.auth);
  const { checkPermissionWithEmail, createPublicCollaborator } =
    usePermission();
  const { setEditable } = useContext(EditContext);

  useEffect(() => {
    const checkPermission = async () => {
      const { responseData } = await checkPermissionWithEmail(id, auth.email);
      if (responseData?.is_public) {
        createPublicCollaborator(id, auth.email);
      }
      if (responseData.share_mode == "view") {
        setEditable(false);
      } else {
        setEditable(true);
      }
    };
    if (id) checkPermission();
  }, [currentNote]);
  return null;
};
