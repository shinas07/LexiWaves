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
import VideoCallRoom from "./pages/VideoCall/StudentVideoRoom";
import PageNotFound from "./pages/PageNotFound";
import StudentProtectedRoute from "./ProtextedRoute";


//User page imports
import UserAccountPage from "./pages/UserPages/AccountDashboard";
import CourseDetail from "./pages/UserPages/CourseDetails";
import CourseList from "./pages/UserPages/CoursePage";
import CourseVideo from "./pages/UserPages/CourseVideo";
import SuccessPage from "./pages/UserPages/PaymentSuccess";
import UserEnrolledCoursesPage from "./pages/UserPages/EnrolledCourses";
import CourseWatchingPage from "./pages/UserPages/CourseWatching";
import SettingsPage from "./pages/UserPages/AccountSettings";
import ForgotPassword from "./pages/UserPages/UserForgotPassword";
import CommunitySelection from "./pages/UserPages/UserCommunity/CommunityChat";
import ProfilePage from "./pages/UserPages/AccountProfile";
import QuizPage from "./pages/UserPages/Quiz";
import StudentUnauthorized from "./pages/UserPages/StudentUnauthorized";
import DocsPage from "./pages/Docs";
import LexiSupportPage from "./pages/Support";
import UserConnection from "./pages/UserPages/UserInteractions/UserTutorConnection";
import CertificateDownload from "./pages/UserPages/CourseQuizCerificates";
import StudentCertificates from "./pages/UserPages/StudentCertificates";

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
import StudentsList from "./pages/TutorPags/StudentsList";
import StudentCourseChats from "./pages/TutorPags/TutorInteraction/StudentChatBoxes";
import TutorChatRoom from "./pages/TutorPags/TutorInteraction/TutorChatRoom";
import VideoCallManagement from "./pages/TutorPags/TutorInteraction/VideoCallManagement";
import TutorVideoRoom from "./pages/VideoCall/TutorVideoRoom";

import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";
// Admin pages import
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentsPage from "./pages/admin/StudentsList";
import Tutorlist from "./pages/admin/ApprovedTutorList";
import TutorRequests from "./pages/admin/TutorRequests";
import AdminSignin from "./pages/admin/SignIn";
import CreateCoursePage from "./pages/TutorPags/CourseCreation";
import TutorDetail from "./pages/admin/TutorDetail";
import AdminLanguages from "./pages/admin/LanguageCreate";
import EnrolledCourses from "./pages/admin/EnrolledCoursesList";
import CourseApprovingPage from "./pages/admin/CourseApprovalPage";
import CourseDetailsCheckPage from "./pages/admin/CourseDetialsCheck";
import AdminCoursesList from "./pages/admin/ApprovedCourseList";
import Unauthorized from "./pages/admin/Unauthorized";
import ChatRoom from "./pages/UserPages/UserCommunity/ChatRoom";
import AdminRevenuePage from "./pages/admin/RevenuePage";
import RevenueReport from "./pages/TutorPags/RevenueReport";
import TutorProfile from "./pages/TutorPags/TutorProfile";
import InteractionStudentsList from "./pages/TutorPags/TutorInteraction/StudentList";
import ReviewSession from "./pages/VideoCall/StudentReview";
import Reports from "./pages/admin/Reports";
import PaymentCancel from "./pages/UserPages/PaymentCancel";
import TutorRevenue from "./pages/TutorPags/TutorRevenue";




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
  const isAuthenticatedUser = localStorage.getItem('accessToken') ;
  const hasSubmittedDetails = localStorage.getItem('hasSubmittedDetails') === 'true';
  return isAuthenticatedUser && hasSubmittedDetails;
};



  return (
    
    <div className="dark">
      {<Toaster expan={false} position="top-right" richColors theme="dark"/>}
   
      <Router>
        <Routes>
          {/* student routes here */}
           {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={isAuthenticatedUser ? <Navigate to="/" /> : <SignUPForm />}
        />
        <Route
          path="/signin"
          element={isAuthenticatedUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/otp"
          element={isAuthenticatedUser ? <Navigate to="/" /> : <OtpVerification />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<PaymentCancel />} />
        <Route path="/lexi-support" element={<LexiSupportPage />} />
      

        {/* Student Routes */}
        <Route path="/courses" element={
          <StudentProtectedRoute>
            <CourseList />
          </StudentProtectedRoute>
        } />
        <Route path="/course/:id" element={
          <StudentProtectedRoute>
            <CourseDetail />
          </StudentProtectedRoute>
        } />
        <Route path="/course-enroll/:id" element={
          <StudentProtectedRoute>
            <CourseVideo />
          </StudentProtectedRoute>
        } />
        <Route path="/enrolled-courses" element={
          <StudentProtectedRoute>
            <UserEnrolledCoursesPage />
          </StudentProtectedRoute>
        } />
        <Route path="/watch-course/:courseId" element={
          <StudentProtectedRoute>
            <CourseWatchingPage />
          </StudentProtectedRoute>
        } />
        <Route path="/community-chat" element={
          <StudentProtectedRoute>
            <CommunitySelection />
          </StudentProtectedRoute>
        } />
        <Route path="/chat/:language" element={
          <StudentProtectedRoute>
            <ChatRoom />
          </StudentProtectedRoute>
        } />
        <Route path="/quiz/:courseId" element={
          <StudentProtectedRoute>
            <QuizPage />
          </StudentProtectedRoute>
        } />
        <Route path="/connect-tutor" element={
          <StudentProtectedRoute>
            <UserConnection />
          </StudentProtectedRoute>
        } />
        <Route path="/student/certificates" element={
          <StudentProtectedRoute>
            <StudentCertificates />
          </StudentProtectedRoute>
        } />
        <Route path="/certificate/download/:courseId" element={
          <StudentProtectedRoute>
            <CertificateDownload />
          </StudentProtectedRoute>
        } />
        <Route path="/settings" element={
          <StudentProtectedRoute>
            <SettingsPage />
          </StudentProtectedRoute>
        } />
        <Route path="/profile" element={
          <StudentProtectedRoute>
            <ProfilePage />
          </StudentProtectedRoute>
        } />
        <Route path="/user-account" element={
          <StudentProtectedRoute>
            <UserAccountPage />
          </StudentProtectedRoute>
        } />
        <Route path="/docs" element={
          <StudentProtectedRoute>
            <DocsPage />
          </StudentProtectedRoute>
        } />

        {/* Video Call Routes */}
        <Route path="/video-call-room/:requestId" element={
       <StudentProtectedRoute>
         <VideoCallRoom />
       </StudentProtectedRoute>
        } />
        <Route path="/review-session/:requestId" element={
          <StudentProtectedRoute>
            <ReviewSession />
          </StudentProtectedRoute>
        } />
        <Route path="/tutor/video-call-room/:requestId" element={
          <StudentProtectedRoute>
            <TutorVideoRoom />
          </StudentProtectedRoute>
        }/>
       

        {/* Unauthorized Route */}
        <Route path="/student/unauthorized" element={<StudentUnauthorized />} />



          {/* Tutors routes here */}
        <Route path="/tutor-signup" element={<ProtectedRoute><TutorSignUP /></ProtectedRoute>}/>
        <Route path="/tutor-otp" element={<ProtectedRoute><TutorOtpVerification /></ProtectedRoute>}/> 
        <Route path="/tutor-signin" element={<ProtectedRoute><TutorLogin /></ProtectedRoute>}/>
        <Route path="/tutor-details" element={<TutorUnauthorizedRoute><TutorDetailForm /></TutorUnauthorizedRoute>}/>
        <Route path="/tutor/dashboard" element={isTutorAllowed() ? <TutorHomePage /> : <Navigate to='/tutor-details'/>} />
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
          <Route path='/tutor/students' element={ <StudentsList/>}/>
          <Route path='/tutor/revenue-report' element={<RevenueReport/>}/>
          <Route path='/tutor/interaction/student-list' element={<InteractionStudentsList/>}/>
          <Route path='/tutor/students/course-chats/:studentId' element={<StudentCourseChats/>}/>
          <Route path='/tutor/chat/:roomId' element={<TutorChatRoom/>}/>
          <Route path="/tutor/video-call-request/:studentId/:courseId" element={<VideoCallManagement />} />
          <Route path='/tutor/revenue' element={<TutorRevenue/>}/>

            



          {/* Admin routes here */}
          <Route path="/admin-access" element={<AdminSignin />} />
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
          <Route path='/admin-revenue-details' element={<AdminProtectedRoute><AdminRevenuePage/></AdminProtectedRoute>}/> 
          <Route path='/admin-report' element={<AdminProtectedRoute><Reports/></AdminProtectedRoute>}/>

          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
