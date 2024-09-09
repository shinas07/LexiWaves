import React from 'react';
import { Link } from 'react-router-dom';


const TutorHomePage = () => {

    const handleLogout = () => {
        sessionStorage.removeItem('access');
        sessionStorage.removeItem('refresh');
        localStorage.removeItem('tutor');
        console.log('logouted')
        
      };
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center items-center">
      {/* Header */}
      <header className="w-full bg-white dark:bg-gray-900 shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tutor Dashboard</h1>
          <nav className="flex space-x-4">
            <Link to="/profile" className="text-sm font-medium text-gray-600 dark:text-gray-200 hover:text-blue-500">Profile</Link>
            <Link to="/courses" className="text-sm font-medium text-gray-600 dark:text-gray-200 hover:text-blue-500">My Courses</Link>
            <button onClick={handleLogout} className="text-sm font-medium text-gray-600 dark:text-gray-200 hover:text-blue-500">Log Out</button>
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-grow w-full flex justify-center items-center">
        <div className="max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-16">
          <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-8">Welcome Back, Tutor!</h2>
          <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-8">
            We're excited to have you here. Let’s get started by managing your courses or checking messages from students.
          </p>

          {/* Call to Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/new-course" className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-center py-3 rounded-md transition-colors shadow-md">
              Create New Course
            </Link>
            <Link to="/messages" className="block bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold text-center py-3 rounded-md transition-colors shadow-md">
              View Messages
            </Link>
            <Link to="/courses" className="block bg-gray-800 hover:bg-gray-900 text-white font-semibold text-center py-3 rounded-md transition-colors shadow-md">
              Manage Your Courses
            </Link>
            <Link to="/profile" className="block bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-center py-3 rounded-md transition-colors shadow-md">
              Update Profile
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-200 dark:bg-gray-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">© 2024 Tutor Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TutorHomePage;
