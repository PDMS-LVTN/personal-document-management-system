import { useLocation, Navigate, Outlet, useParams } from "react-router-dom";
import { useAuthentication } from "../store/useAuth";

const RequireAuth = () => {
  const auth = useAuthentication((state) => state.auth);
  const location = useLocation();
  const { noteId } = useParams();
  const hash = location.hash;
  if (hash) return <Outlet context={{ data: window.documentData }} />;
  if (noteId) {
    // TODO: check
    //if file is in sharing mode => check if it has direct access =>
    // if yes prompt to google login => if denied treat it like anonymous mode
    // if no => treat it as anonymous mode
    console.log(location.state);
    if (location.state?.data) {
      return <Outlet context={{ data: location.state.data }} />;
    }
    return (
      <Navigate
        to="/login"
        state={{ isShared: true, noteId: noteId, from: location }}
      />
    );
  }
  console.log("noteId", noteId);

  return (
    // auth?.roles?.find(role => allowedRoles?.includes(role))
    //     ? <Outlet />
    //     : auth?.user
    //         ? <Navigate to="/unauthorized" state={{ from: location }} replace />
    //         : <Navigate to="/login" state={{ from: location }} replace />
    auth ? (
      <Outlet />
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    )
  );
};

export default RequireAuth;
