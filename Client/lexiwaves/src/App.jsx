import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignupComponent from './pages/SignUpPage'
import Home from './pages/HomePage'


const App = () => {
  return (
    <div className='dark'>
    <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="signup/" element={<SignupComponent />} />
          {/* Add other routes here */}
        </Routes>
    </Router>
    </div>
  );
};

export default App;