import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireRole = ({ allowedRoles }) => {
  const location = useLocation();
  const { role, session } = useSelector((state) => state.sessionReducer);

  return allowedRoles.includes(role) ? (
    <Outlet />
  ) : session ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default RequireRole;
