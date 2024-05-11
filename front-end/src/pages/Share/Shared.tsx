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
  // const [permission, setPermission] = useState(null);
  const { setEditable } = useContext(EditContext);

  useEffect(() => {
    const checkPermission = async () => {
      const { responseData } = await checkPermissionWithEmail(id, auth.email);
      console.log(responseData);
      console.log(responseData.share_mode);

      // if (responseData) {
      //   setPermission(responseData.share_mode);
      // }
      if (responseData?.is_public) {
        createPublicCollaborator(id, auth.email);
      }
      if (responseData.share_mode == "view") {
        setEditable(false);
      } else {
        setEditable(true);
      }
      // console.log(window.editor);
    };
    if (id) checkPermission();
  }, [currentNote]);

  // if (!permission) return null;
  // return <SharedNotesContainer />;
  return null;
};
