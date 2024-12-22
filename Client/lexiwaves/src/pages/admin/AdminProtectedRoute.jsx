import { useRadioGroup } from "@mui/material";
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = ({ children }) => {
    const userRole = useSelector((state) => state.auth.userRole)

    if (userRole !== 'admin'){
        return <Navigate to='/admin-unauthorized'/>
    }
    return children;

};

export default AdminProtectedRoute;
