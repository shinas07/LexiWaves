import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignUPForm from "./pages/UserPages.jsx/SignUpPage";
import Home from "./pages/HomePage";
import Login from "./pages/UserPages.jsx/SignInPage";
import OtpVerification from "./pages/UserPages.jsx/UserOtpPage";
// import { Provider, useSelector} from 'react-redux';

//User page imports
import UserAccountPage from "./pages/UserPages.jsx/UserAccountPage";

// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; // Import default styles

import { Toaster } from "sonner";

//Tutor pages import
import TutorSignUP from "./pages/TutorPags/SignUp";
import TutorOtpVerification from "./pages/TutorPags/TutorOtp";
import TutorLogin from "./pages/TutorPags/SignIn";
import TutorSetup from "./pages/TutorPags/TutorSetup ";
import TutorHomePage from "./pages/TutorPags/TutorDashboard";
import TutorDetails from "./pages/TutorPags/TutorDetails";

// Admin pages import
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentsPage from "./pages/admin/StudentsList";
import Tutorlist from "./pages/admin/ApprovedTutorList";
import TutorRequests from "./pages/admin/TutorRequests";
import AdminSignup from "./pages/admin/SignIn";
import CreateCoursePage from "./pages/TutorPags/CourseCreation";
import TutorDetail from "./pages/admin/TutorDetail";
import AdminLanguages from "./pages/admin/LanguageCreate";
// import  CustomToaster  from './pages/CustomToaster';
import { useSelector } from "react-redux";
import CourseList from "./pages/UserPages.jsx/CoursePage";
//Redux
const App = () => {
  const isAuthenticatedUser = useSelector((state) => state.auth.isAuthenticated);
  // const isAuthenticatedTutor = useSelector((state) => state.tutor.isAuthenticated);



  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('tutor');
    return token ? <Navigate to="/tutor-dashboard" /> : children;
  };



  return (
    <div className="dark">
      {<Toaster expan={false} theme="dark" position="top-right" />}

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={isAuthenticatedUser ? <Navigate to="/" /> : <SignUPForm />}/>
          <Route path="/signin" element={isAuthenticatedUser ? <Navigate to="/" /> : <Login />}/>

          <Route path="/otp" element={isAuthenticatedUser ? <Navigate to="/" /> : <OtpVerification />}/>
          
          <Route path="/user-account" element={!isAuthenticatedUser ? <Navigate to="/signin" /> : <UserAccountPage />
            }
          />
          <Route path="/courses" element={<CourseList/>}></Route>

          {/* Tutors routes here */}



       

          <Route
          path="/tutor-signup"
          element={<ProtectedRoute><TutorSignUP /></ProtectedRoute>}/>
        
        <Route
          path="/tutor-otp"
          element={<ProtectedRoute><TutorOtpVerification /></ProtectedRoute>}/>
        <Route path="/tutor-signin" element={<ProtectedRoute><TutorLogin /></ProtectedRoute>}/>
            <Route path="/tutor-details" element={<TutorDetails></TutorDetails>}></Route>
          <Route path="/tutor-dashboard" element={<TutorHomePage />} />
          <Route path="/tutor-setup" element={<TutorSetup />} />
          <Route path="/tutor-details" element={<TutorDetails />} />
          <Route path="/tutor-reqeusts" element={<TutorRequests />} />
          <Route path="/tutor-create-course" element={<CreateCoursePage />} />
          



          {/* Admin routes here */}
          <Route path="/admin-login" element={<AdminSignup />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-students-list" element={<StudentsPage />} />
          <Route path="/admin-tutor-list" element={<Tutorlist />} />
          <Route
            path="/admin-tutor-details/:tutorId"
            element={<TutorDetail />}
          />
          <Route path="/admin-language" element={<AdminLanguages/>}/>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
