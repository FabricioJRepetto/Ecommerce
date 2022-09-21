import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireRole = ({ allowedRoles }) => {
  const location = useLocation();
  const { role, session } = useSelector((state) => state.sessionReducer);  

  return !session ? ('Checking credentials') : allowedRoles.includes(role) ? (
    <Outlet />
  ) : (
    // <Navigate to="/unauthorized" state={{ from: location }} replace />
    'unauthorized'.toUpperCase()
  ) 
};

export default RequireRole;
