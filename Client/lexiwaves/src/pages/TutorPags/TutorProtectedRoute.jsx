import React from "react";
import { Navigate } from "react-router-dom";

const TutorUnauthorizedRoute = ({children}) => {
    const userRole = localStorage.getItem('userRole');
    if(userRole !== 'tutor'){
        return <Navigate to='/tutor-unauthorized'/>
    }
    return children

}

export default TutorUnauthorizedRoute;