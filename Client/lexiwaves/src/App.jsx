import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignUPForm from "./pages/UserPages/SignUpPage";
import Home from "./pages/HomePage";
import Login from "./pages/UserPages/SignInPage";
import OtpVerification from "./pages/UserPages/UserOtpPage";
import { useSelector } from "react-redux";
import { Toaster, toast } from 'sonner';

//User page imports
import UserAccountPage from "./pages/UserPages/AccountDashboard";
import CourseDetail from "./pages/UserPages/CourseDetails";
import CourseList from "./pages/UserPages/CoursePage";
import CourseVideo from "./pages/UserPages/CourseVideo";
import SuccessPage from "./pages/UserPages/PaymentSuccessPage";
import UserEnrolledCoursesPage from "./pages/UserPages/EnrolledCourses";
import CourseWatchingPage from "./pages/UserPages/CourseWatching";
import SettingsPage from "./pages/UserPages/AccountSettings";
import ForgotPassword from "./pages/UserPages/UserForgotPassword";
import CommunitySelection from "./pages/UserPages/CommunityChat";
import ProfilePage from "./pages/UserPages/AccountProfile";
import QuizPage from "./pages/UserPages/Quiz";
import TutorListForConnection from "./pages/UserPages/UserInteractions/TutorList";
import UserConnection from "./pages/UserPages/UserInteractions/UserTutorConnection"

//Tutor pages import
import TutorSignUP from "./pages/TutorPags/SignUp";
import TutorOtpVerification from "./pages/TutorPags/TutorOtp";
import TutorLogin from "./pages/TutorPags/SignIn";
import TutorSetup from "./pages/TutorPags/TutorSetup ";
import WaitingForApproval from "./pages/TutorPags/WaitingAdminApproval";
import TutorHomePage from "./pages/TutorPags/TutorDashboard";
import TutorDetailForm from "./pages/TutorPags/TutorDetails"
import TutorCreatedCourses from "./pages/TutorPags/CreatedCourses";
import EnrolledCoursesListTutorSide from "./pages/TutorPags/EnrolledCoruseListTutor";
import TutorLearnMore from "./pages/TutorPags/LearnMore";
import SupportPage from "./pages/TutorPags/SupportPage";
import TermsOfService from "./pages/TutorPags/TermsOfService";
import CreateQuiz from "./pages/TutorPags/CreateQuiz";
import CourseEdit from "./pages/TutorPags/EditCourse";
import CourseAndQuizDetails from "./pages/TutorPags/CourseAllDetails";
import TutorUnauthorized from "./pages/TutorPags/TutorPagesUnauthorized";
import TutorUnauthorizedRoute from "./pages/TutorPags/TutorProtectedRoute";
import TutorProfileDetails from "./pages/UserPages/UserInteractions/TutorProfile";
import StudentsList from "./pages/TutorPags/StudentsList";

import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";
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
import CourseApprovingPage from "./pages/admin/CourseApprovalPage";
import CourseDetailsCheckPage from "./pages/admin/CourseDetialsCheck";
import AdminCoursesList from "./pages/admin/ApprovedCourseList";
import Unauthorized from "./pages/admin/Unauthorized";
import ChatRoom from "./pages/UserPages/ChatRoom";
import AdminRevenuePage from "./pages/admin/RevenuePage";
import RevenueReport from "./pages/TutorPags/RevenueReport";
import TutorProfile from "./pages/TutorPags/TutorProfile";





const App = () => {
  const isAuthenticatedUser = useSelector((state) => state.auth.isAuthenticated);
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [errorMessage, setErrorMessage] = useState('');






  useEffect(() => {
    // Function to handle when the user goes offline
    const handleOffline = () => {
      toast.error('You are currently offline!', {
        duration: 5000, 
      });
    };
    const handleOnline = () => {
      toast.success('You are back online!', {
        duration: 5000,
      
      });
    };

    // Adding event listeners for online and offline events
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []); 


  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');
    return token ? <Navigate to="/tutor/dashboard" /> : children;
    
  };




// For Tutor 
const isTutorAllowed = () => {
  const isAuthenticatedUser = !!localStorage.getItem('accessToken');
  const hasSubmittedDetails = localStorage.getItem('hasSubmittedDetails') === 'true';
  const adminApproved = localStorage.getItem('adminApproved') === 'true';

  return isAuthenticatedUser && hasSubmittedDetails && adminApproved;
};



  return (
    
    <div className="dark">

      {<Toaster expan={false} position="top-right" />}

      <Router>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/signup" element={isAuthenticatedUser ? <Navigate to="/" /> : <SignUPForm />}/>
          <Route path="/signin" element={isAuthenticatedUser ? <Navigate to="/" /> : <Login />}/>
          

          <Route path="/otp" element={isAuthenticatedUser ? <Navigate to="/" /> : <OtpVerification />}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
          <Route path="/user-account" element={!isAuthenticatedUser ? <Navigate to="/signin" /> : <UserAccountPage />}/>
          <Route path="/settings" element={!isAuthenticatedUser ? <Navigate to="/signin" /> : <SettingsPage />} />
          <Route path="/courses" element={<CourseList/>}></Route>
          <Route path="/course/:id" element={<CourseDetail/>}/>
          <Route path='course-enroll/:id' element={!isAuthenticatedUser ? <Navigate to="/signin "/> : <CourseVideo/>}/>
          <Route path='/success' element={<SuccessPage/>}/>
          <Route path='/enrolled-courses' element={!isAuthenticatedUser ? <Navigate to="/signin "/> : <UserEnrolledCoursesPage/>}/>
            <Route path="/watch-course/:courseId"  element={!isAuthenticatedUser ? <Navigate to="/signin "/> : <CourseWatchingPage/>}/>
          
          <Route path="/community-chat" element={!isAuthenticatedUser ? <Navigate to="/signin" /> : <CommunitySelection />}/>
          
          <Route path="/chat/:language" element={!isAuthenticatedUser ? <Navigate to="/signin" /> : <ChatRoom />} />
          <Route path="/quiz/:courseId" element={!isAuthenticatedUser ? <Navigate to="/signin" /> : <QuizPage />} />
          <Route path='/tutor-list-connection' element={!isAuthenticatedUser ? <Navigate to="/signin"/> : <TutorListForConnection/> }/>
          <Route path='/connect-tutor' element={<UserConnection/>}/>
          <Route path='/tutor-profile-detatil/:id' element={<TutorProfileDetails/>}/>
          
          

          {/* Tutors routes here */}
        <Route path="/tutor-signup" element={<ProtectedRoute><TutorSignUP /></ProtectedRoute>}/>
        <Route path="/tutor-otp" element={<ProtectedRoute><TutorOtpVerification /></ProtectedRoute>}/> 
        <Route path="/tutor-signin" element={<ProtectedRoute><TutorLogin /></ProtectedRoute>}/>
        <Route path="/tutor-details" element={<TutorUnauthorizedRoute><TutorDetailForm /></TutorUnauthorizedRoute>}/>
        <Route path="/tutor/dashboard"element={isTutorAllowed() ? <TutorHomePage /> : <Navigate to='/waiting-for-approval'/>} />
          <Route path="/tutor-setup" element={<TutorSetup />} />
            <Route path="/tutor-requests" element={!isAuthenticatedUser ? <Navigate to="/tutor-signin" /> : <TutorRequests />} />
            <Route path="/waiting-for-approval" element={<TutorUnauthorizedRoute><WaitingForApproval /></TutorUnauthorizedRoute>} />
            <Route path="/tutor-create-course" element={isTutorAllowed() ? <CreateCoursePage /> : <Navigate to="/waiting-for-approval" />} />
            <Route path='/terms-of-service' element={<TermsOfService/>}></Route>
            <Route path='/tutor/profile' element={<TutorProfile/>}/>
            <Route path="/tutor-course-list" element={isTutorAllowed() ? <TutorCreatedCourses/> : <Navigate to="/waiting-for-approval" />} />
            <Route path="/tutor-enrolled-course-list" element={isTutorAllowed() ? <EnrolledCoursesListTutorSide /> :<Navigate to="/waiting-for-approval" /> } />
          <Route path='/tutor-learn-more' element={<TutorLearnMore/>}/>
          <Route path="/tutor-support" element={<SupportPage/>}/>
          <Route path="/create-quiz/:courseId" element={isTutorAllowed() ? <CreateQuiz /> : <Navigate to='/waiting-for-approval'/>} />
          <Route path="/course/:courseId/edit" element={isTutorAllowed() ? <CourseEdit /> : <Navigate to='/waiting-for-approval'/>} />
          <Route path="/tutor/courses/details/:courseId" element={isTutorAllowed() ? <CourseAndQuizDetails/> : <Navigate to='waiting-for-approval'/>}/>
          <Route path='/tutor-unauthorized' element={<TutorUnauthorized/>}/>
          <Route path='/tutor/students' element={<StudentsList/>}/>
          <Route path='/tutor/revenue-report' element={<RevenueReport/>}/>
          

            



          {/* Admin routes here */}
          <Route path="/admin-login" element={<AdminSignup />} />
          <Route path="/admin-dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          <Route path="/admin-students-list" element={<AdminProtectedRoute><StudentsPage/></AdminProtectedRoute>} />
          <Route path="/admin-tutor-list" element={<AdminProtectedRoute><Tutorlist /></AdminProtectedRoute>} />
          <Route path="/admin-tutor-details/:tutorId" element={<AdminProtectedRoute><TutorDetail /></AdminProtectedRoute>}/>
          <Route path="/admin-language" element={<AdminProtectedRoute><AdminLanguages/></AdminProtectedRoute>}/>
          <Route path="/admin-approved-courses-list" element={<AdminProtectedRoute><AdminCoursesList/></AdminProtectedRoute>}/>
          <Route path="/admin-course-requests" element={<AdminProtectedRoute><CourseApprovingPage/></AdminProtectedRoute>}/>
          <Route path='/admin-course-details/:courseId' element={<AdminProtectedRoute><CourseDetailsCheckPage/></AdminProtectedRoute>}/>
          <Route path="/admin-enrolled-courses" element={<AdminProtectedRoute><EnrolledCourses/></AdminProtectedRoute>}/>
          <Route path="/admin-tutor-requests" element={<AdminProtectedRoute><TutorRequests/></AdminProtectedRoute>}/>
          <Route path="/admin-unauthorized" element={<Unauthorized />} />
          <Route path='/admin-revenue-details' element={<AdminRevenuePage/>}/> 

        </Routes>
      </Router>
    </div>
  );
};

export default App;
