import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaEnvelope, FaEdit, FaBookOpen, FaSignOutAlt, FaUserGraduate, FaChartLine } from 'react-icons/fa';

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
        <div className="min-h-screen bg-neutral-900 text-gray-200 flex flex-col">
            {/* Header */}
            <header className="w-full bg-gradient-to-r from-gray-700 to-gray-900 shadow-md py-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-gray-100">Lexiwaves Tutor Dashboard</h1>
                    <nav className="flex space-x-6">
                        <Link to="/profile" className="text-lg font-medium hover:text-gray-400 transition duration-300">Profile</Link>
                        <Link to="/courses" className="text-lg font-medium hover:text-gray-400 transition duration-300">My Courses</Link>
                        <button 
                            onClick={handleLogout} 
                            className="flex items-center space-x-2 text-lg font-medium hover:text-gray-400 transition duration-300"
                        >
                            <FaSignOutAlt className="text-xl" />
                            <span>Log Out</span>
                        </button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 py-20">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-5xl font-bold text-gray-100 mb-4">Welcome Back, Tutor!</h2>
                    <p className="text-lg text-gray-400">Empower your students with interactive lessons and track your progress easily.</p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-neutral-700 p-6 rounded-lg shadow-lg text-center">
                        <FaBookOpen className="text-4xl text-gray-100 mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-100">5 Courses</h3>
                        <p className="text-gray-400">You are currently teaching 5 active courses.</p>
                    </div>
                    <div className="bg-neutral-700 p-6 rounded-lg shadow-lg text-center">
                        <FaUserGraduate className="text-4xl text-gray-100 mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-100">120 Students</h3>
                        <p className="text-gray-400">You have 120 students enrolled in your courses.</p>
                    </div>
                    <div className="bg-neutral-700 p-6 rounded-lg shadow-lg text-center">
                        <FaEnvelope className="text-4xl text-gray-100 mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-100">8 Messages</h3>
                        <p className="text-gray-400">You have 8 unread messages from students.</p>
                    </div>
                    <div className="bg-neutral-700 p-6 rounded-lg shadow-lg text-center">
                        <FaChartLine className="text-4xl text-gray-100 mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-100">4.9 Rating</h3>
                        <p className="text-gray-400">Your courses have an average rating of 4.9/5.</p>
                    </div>
                </div>
            </div>

            {/* Main Section */}
            <main className="flex-grow w-full flex justify-center items-center">
                <div className="max-w-4xl bg-neutral-800 rounded-lg shadow-lg p-10 md:p-16">
                    <h2 className="text-4xl font-bold text-center mb-10 text-gray-100">Tutor Actions</h2>
                    <p className="text-lg text-center mb-10 text-gray-400">
                        Manage your courses, communicate with students, and update your profile in one place.
                    </p>

                    {/* Call to Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Link to="/tutor-create-course" className="flex items-center justify-center space-x-3 bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-4 rounded-lg transition duration-300 shadow-md">
                            <FaChalkboardTeacher className="text-2xl" />
                            <span>Create New Course</span>
                        </Link>
                        <Link to="/messages" className="flex items-center justify-center space-x-3 bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-4 rounded-lg transition duration-300 shadow-md">
                            <FaEnvelope className="text-2xl" />
                            <span>View Messages</span>
                        </Link>
                        <Link to="/courses" className="flex items-center justify-center space-x-3 bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-4 rounded-lg transition duration-300 shadow-md">
                            <FaBookOpen className="text-2xl" />
                            <span>Manage Courses</span>
                        </Link>
                        <Link to="/profile" className="flex items-center justify-center space-x-3 bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-4 rounded-lg transition duration-300 shadow-md">
                            <FaEdit className="text-2xl" />
                            <span>Update Profile</span>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full bg-neutral-800 py-8 mt-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center space-x-6 mb-6">
                        <a href="#" className="text-gray-400 hover:text-gray-100 transition duration-300">
                            <FaEnvelope className="text-xl" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-100 transition duration-300">
                            <FaBookOpen className="text-xl" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-100 transition duration-300">
                            <FaEdit className="text-xl" />
                        </a>
                    </div>
                    <p className="text-sm text-gray-400">© 2024 Lexiwaves. Empowering Learning Everywhere.</p>
                </div>
            </footer>
        </div>
    );
};

export default TutorHomePage;
