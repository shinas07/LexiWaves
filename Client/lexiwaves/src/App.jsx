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
import CourseDetail from "./pages/UserPages.jsx/CourseDetails";
import CourseList from "./pages/UserPages.jsx/CoursePage";
import CourseVideo from "./pages/UserPages.jsx/CourseVideo";
import SuccessPage from "./pages/UserPages.jsx/PaymentSuccessPage";
import UserEnrolledCoursesPage from "./pages/UserPages.jsx/EnrolledCourses";
import CourseWatchingPage from "./pages/UserPages.jsx/CourseWatching";
import SettingsPage from "./pages/UserPages.jsx/AccountSettings";


import { Toaster } from "sonner";

//Tutor pages import
import TutorSignUP from "./pages/TutorPags/SignUp";
import TutorOtpVerification from "./pages/TutorPags/TutorOtp";
import TutorLogin from "./pages/TutorPags/SignIn";
import TutorSetup from "./pages/TutorPags/TutorSetup ";
import TutorHomePage from "./pages/TutorPags/TutorDashboard";
import TutorDetails from "./pages/TutorPags/TutorDetails";
import TutorCreatedCourses from "./pages/TutorPags/CreatedCourses";
import EnrolledCoursesListTutorSide from "./pages/TutorPags/EnrolledCoruseListTutor";


// Admin pages import
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentsPage from "./pages/admin/StudentsList";
import Tutorlist from "./pages/admin/ApprovedTutorList";
import TutorRequests from "./pages/admin/TutorRequests";
import AdminSignup from "./pages/admin/SignIn";
import CreateCoursePage from "./pages/TutorPags/CourseCreation";
import TutorDetail from "./pages/admin/TutorDetail";
import AdminLanguages from "./pages/admin/LanguageCreate";
import EnrolledCourses from "./pages/admin/EnrolledCoursesList";
// import  CustomToaster  from './pages/CustomToaster';
import { useSelector } from "react-redux";
import { ImageOff } from "lucide-react";




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
          <Route path="/settings" element={!isAuthenticatedUser ? <Navigate to="/signin" /> : <SettingsPage />} />
          <Route path="/courses" element={<CourseList/>}></Route>
          <Route path="/course/:id" element={<CourseDetail/>}/>
          <Route path='course-enroll/:id' element={!isAuthenticatedUser ? <Navigate to="/signin "/> : <CourseVideo/>}/>
          <Route path='/success' element={<SuccessPage/>}/>
          <Route path='/enrolled-courses' element={!isAuthenticatedUser ? <Navigate to="/signin "/> : <UserEnrolledCoursesPage/>}/>
            <Route path="/watch-course/:courseId"  element={!isAuthenticatedUser ? <Navigate to="/signin "/> : <CourseWatchingPage/>}/>







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
          <Route path="/tutor-course-list" element={<TutorCreatedCourses/>}></Route>
          <Route path="/tutor-enrolled-course-list" element={<EnrolledCoursesListTutorSide/>}></Route>

            



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
          <Route path='/admin/enrolled-courses/' element={<EnrolledCourses/>}/>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
