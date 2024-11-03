import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
    const userRole = localStorage.getItem('userRole');

    if (userRole !== 'admin'){
        return <Navigate to='/admin-unauthorized'/>
    }
    return children;

};

export default AdminProtectedRoute;
