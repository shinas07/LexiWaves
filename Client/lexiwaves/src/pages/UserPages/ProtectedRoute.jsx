import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {useSelector } from 'react-redux';
const StudentProtectedRoute = ({ children }) => {
   const { isAuthenticated, userRole } = useSelector((state) => state.auth);
   const location = useLocation();
   
   
    // If not authenticated, redirect to sign-in
   if (!isAuthenticated) {
       return <Navigate to='/signin' state={{ from: location }} replace />;
   }
    // If the user role is not 'student', redirect to unauthorized page
   if (userRole !== 'student') {
       return <Navigate to="/student/unauthorized" replace />;
   }
    // If all checks pass, render the children
   return children;
  };
export default StudentProtectedRoute;