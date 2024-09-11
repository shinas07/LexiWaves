import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TutorHomePage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('access');
        sessionStorage.removeItem('refresh');
        localStorage.removeItem('tutor');
        console.log('Logged out');
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <header className="w-full bg-gray-800 shadow-md py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-400">Lexiwaves Tutor Dashboard</h1>
                    <nav className="flex space-x-4">
                        <Link to="/profile" className="text-sm font-medium hover:text-gray-400">Profile</Link>
                        <Link to="/courses" className="text-sm font-medium hover:text-gray-400">My Courses</Link>
                        <button onClick={handleLogout} className="text-sm font-medium hover:text-gray-400">Log Out</button>
                    </nav>
                </div>
            </header>

            {/* Main Section */}
            <main className="flex-grow w-full flex justify-center items-center">
                <div className="max-w-4xl bg-gray-800 rounded-lg shadow-lg p-8 md:p-16">
                    <h2 className="text-3xl font-semibold text-center mb-8 text-gray-200">Welcome Back, Tutor!</h2>
                    <p className="text-lg text-center mb-8 text-gray-400">
                        We're excited to have you here. Let’s get started by managing your courses or checking messages from students.
                    </p>

                    {/* Call to Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link to="/new-course" className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-center py-3 rounded-md transition-colors shadow-md">
                            Create New Course
                        </Link>
                        <Link to="/messages" className="block bg-blue-700 hover:bg-blue-800 text-white font-semibold text-center py-3 rounded-md transition-colors shadow-md">
                            View Messages
                        </Link>
                        <Link to="/courses" className="block bg-gray-700 hover:bg-gray-800 text-white font-semibold text-center py-3 rounded-md transition-colors shadow-md">
                            Manage Your Courses
                        </Link>
                        <Link to="/profile" className="block bg-gray-600 hover:bg-gray-700 text-white font-semibold text-center py-3 rounded-md transition-colors shadow-md">
                            Update Profile
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full bg-gray-800 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm text-gray-400">© 2024 Lexiwaves. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default TutorHomePage;
