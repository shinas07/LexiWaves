import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRouted = ({ children, allowedRoles }) => {
    const { isAuthenticated, userRole } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to='/signin' state={{ from: location}} replace />;
    }

    if (!allowedRoles.includes(userRole)){
        switch (userRole) {
            case 'student':
              return <Navigate to="/student/unauthorized" replace />;
            case 'tutor':
              return <Navigate to="/student/unauthorized" replace />;
            case 'admin':
              return <Navigate to="/admin-unauthorized" replace />;
            default:
              return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
};