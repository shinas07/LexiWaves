import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUPForm from './pages/SignUpPage';
import Home from './pages/HomePage';
import Login from './pages/SignInPage';
import OtpVerification from './pages/UserOtpPage';
// import { Provider, useSelector} from 'react-redux';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import default styles
import './toastStyles.css'; // Import custom styles





//Tutor pages import
import TutorSignUP from './pages/TutorPags/SignUp';
import TutorOtpVerification from './pages/TutorPags/TutorOtp';
import TutorLogin from './pages/TutorPags/SignIn';
import TutorSetup from './pages/TutorPags/TutorSetup ';
import TutorHomePage from './pages/TutorPags/TutorDashboard';
import TutorDetails from './pages/TutorPags/TutorDetails';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tutorLoggedIn, setTutorLoggedIn] = useState(false)




  useEffect(() => {
    const checkAuth = () => {
      const accessToken = sessionStorage.getItem('access');
      const tutorData = localStorage.getItem('tutor')
      if (accessToken) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }

      if(tutorData){
        setTutorLoggedIn(true);
      }else {
        setTutorLoggedIn(false)
      }

    };

    checkAuth();
    // Add event listener for changes to authentication status
    window.addEventListener('storage', checkAuth);

    return () => window.removeEventListener('storage', checkAuth);
  }, []);

 
  return (
    <div className='dark'>  
        <Router>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <SignUPForm />} />
            <Route path="/signin" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />

            <Route path="/otp" element={<OtpVerification />} />
            {/* Tutors routes here */}
            <Route path='/tutor-signup' element={tutorLoggedIn ? <Navigate to="/tutor-dashboard" /> : <TutorSignUP />} />
          <Route path='/tutor-otp' element={<TutorOtpVerification />} />
          <Route path='/tutor-signin' element={tutorLoggedIn ? <Navigate to="/tutor-dashboard" /> : <TutorLogin />} />
          <Route path='/tutor-dashboard' element={<TutorHomePage />} />
          <Route path='/tutor-setup' element={<TutorSetup />} />
          <Route path='/tutor-details' element={<TutorDetails/>}/>
          </Routes>
          <ToastContainer />
        </Router>
    </div>
  );
};

export default App;
