import { useLocation, Navigate, Outlet, useParams } from "react-router-dom";
import { useAuthentication } from "../store/useAuth";
import { useEffect, useState } from "react";
import { usePermission } from "@/hooks/usePermission";

const RequireAuth = () => {
  const auth = useAuthentication((state) => state.auth);
  const location = useLocation();
  const { noteId } = useParams();
  const hash = location.hash;
  const { checkGeneralPermission, checkPermissionWithEmail } = usePermission();
  const [hasPermission, setHasPermission] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const checkPermission = async () => {
      const responseData = await checkGeneralPermission(noteId);
      if (responseData) {
        setData(responseData);
      } else if (auth) {
        const { responseData, responseError } = await checkPermissionWithEmail(
          noteId,
          auth.email
        );
        setData(responseData);
        setError(responseError);
      }
      setHasPermission(true);
    };
    if (noteId && !location.state?.data) {
      checkPermission();
    } else setHasPermission(true);
  }, []);

  if (!hasPermission) return null;

  if (hash) return <Outlet context={{ data: window.documentData }} />;

  if (noteId) {
    // go to shared page after login
    if (location.state?.data)
      return <Outlet context={{ data: location.state.data }} />;
    if (data) return <Outlet context={{ data }} />;
    if (error)
      return (
        <Navigate
          to="/unauthorized"
          state={{ isShared: true, noteId: noteId, from: location.pathname }}
        />
      );

    return (
      <Navigate
        to="/login"
        state={{ isShared: true, noteId: noteId, from: location.pathname }}
      />
    );
  }

  return (
    // auth?.roles?.find(role => allowedRoles?.includes(role))
    //     ? <Outlet />
    //     : auth?.user
    //         ? <Navigate to="/unauthorized" state={{ from: location }} replace />
    //         : <Navigate to="/login" state={{ from: location }} replace />
    auth ? (
      <Outlet />
    ) : (
      <Navigate to="/login" state={{ from: location.pathname }} replace />
    )
  );
};

export default RequireAuth;
