import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useAuthentication } from "../store/useAuth";

const RequireAuth = () => {
  const auth = useAuthentication((state) => state.auth);
  const location = useLocation();

  return (
    // auth?.roles?.find(role => allowedRoles?.includes(role))
    //     ? <Outlet />
    //     : auth?.user
    //         ? <Navigate to="/unauthorized" state={{ from: location }} replace />
    //         : <Navigate to="/login" state={{ from: location }} replace />
    auth?.email ? (
      <Outlet />
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    )
  );
};

export default RequireAuth;
