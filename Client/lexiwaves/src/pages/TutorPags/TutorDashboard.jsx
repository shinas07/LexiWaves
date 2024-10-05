import React, { useDebugValue, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Mail, 
  Edit, 
  LogOut, 
  User, // Replacement for UserGraduate
  TrendingUp,
  Bell,
  Menu,
  X,
  Home,
  Settings,
  Calendar,
  Plus,
} from 'lucide-react';
import { logout } from '../../redux/authSlice';
import { useDispatch } from 'react-redux';
import api from '../../service/api';

const TutorDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);
  const dispach = useDispatch()

  useEffect(() => {
    const checkTutorApproval = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get('tutor/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setLoading(false);
  
        // if (response.status === 200 && response.data.detail === "Tutor details missing. Complete your profile.") {
        //   // Case: Tutor details are missing
        //   alert('Complete your tutor profile details.');
        //   navigate('/tutor-details');  // Redirect to tutor details page
        // } else if (!response.data.profile.admin_approved) {
        //   // Case: Admin approval pending
        //   alert('Your account is pending for admin approval.');
        //   navigate('/pending-approval');  // Redirect to waiting page
        // } else if (response.status === 200) {
        //   // Case: Access granted to dashboard (handle as needed)
        //   console.log('/dashboard')
        // }
  
      } catch (err) {
        setLoading(false);
        console.log(response)
        console.error(err.message);
      }
    };
  
    checkTutorApproval();
  }, [navigate]);
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
 

  const handleLogout = () => {
    dispach(logout())
    localStorage.removeItem('tutor');
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCreateCourse = () => {
    navigate("/tutor-create-course")
  }

  const courses = [
    { id: 1, name: 'Enlish for Beginner', students: 45, rating: 4.8 },
    { id: 2, name: 'Spanish for Travelers', students: 32, rating: 4.9 },
    { id: 3, name: 'German Language Basics', students: 28, rating: 4.7 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-indigo-700 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <nav>
          <div className="flex items-center justify-between mb-6 px-4">
            <span className="text-2xl font-semibold">Lexiwaves</span>
            <button onClick={toggleSidebar} className="md:hidden">
              <X size={24} />
            </button>
          </div>
          <Link to="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white">
            <Home size={20} className="inline-block mr-2" />
            Dashboard
          </Link>
          <Link to="/tutor-course-list" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white">
            <BookOpen size={20} className="inline-block mr-2" />
            My Courses
          </Link>
          <Link to="/messages" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white">
            <Mail size={20} className="inline-block mr-2" />
            Messages
          </Link>
          <Link to="/calendar" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white">
            <Calendar size={20} className="inline-block mr-2" />
            Calendar
          </Link>
          <Link to="/profile" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white">
            <User size={20} className="inline-block mr-2" /> {/* Changed from UserGraduate to User */}
            Profile
          </Link>
          <Link to="/settings" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 hover:text-white">
            <Settings size={20} className="inline-block mr-2" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-md">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden">
                <Menu size={24} />
              </button>
              <h1 className="text-2xl font-semibold text-gray-800 ml-4">Tutor Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Bell size={24} />
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                <LogOut size={20} className="mr-2" />
                Log Out
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75">
                    <BookOpen size={24} className="text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="mb-2 text-sm font-medium text-gray-600">Courses</p>
                    <p className="text-lg font-semibold text-gray-700">5</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-600 bg-opacity-75">
                    <User size={24} className="text-white" /> {/* Changed from UserGraduate to User */}
                  </div>
                  <div className="ml-4">
                    <p className="mb-2 text-sm font-medium text-gray-600">Students</p>
                    <p className="text-lg font-semibold text-gray-700">10</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-600 bg-opacity-75">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="mb-2 text-sm font-medium text-gray-600">New Messages</p>
                    <p className="text-lg font-semibold text-gray-700">2</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-600 bg-opacity-75">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="mb-2 text-sm font-medium text-gray-600">Average Rating</p>
                    <p className="text-lg font-semibold text-gray-700">4.9</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course List and Details */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Course List */}
              <div className="md:w-1/2">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Courses</h2>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  {courses.map((course) => (
                    <div 
                      key={course.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedCourse === course.id ? 'bg-indigo-50' : ''}`}
                      onClick={() => setSelectedCourse(course.id)}
                    >
                      <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                      <p className="text-sm text-gray-600">Students: {course.students} | Rating: {course.rating}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Details */}
              <div className="md:w-1/2">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Details</h2>
                {selectedCourse ? (
                  <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{courses.find(c => c.id === selectedCourse).name}</h3>
                    <p className="text-gray-600 mb-4">Detailed information about the selected course goes here. This could include a course description, upcoming lessons, or recent student activity.</p>
                    <div className="flex justify-end">
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                        View Full Details
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white shadow-md rounded-lg p-6 text-center text-gray-600">
                    Select a course to view its details
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center" onClick={handleCreateCourse}>
                  <Plus size={20} className="mr-2" />
                  Create New Course
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center">
                  <Mail size={20} className="mr-2" />
                  Send Broadcast Message
                </button>
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center">
                  <Calendar size={20} className="mr-2" />
                  Schedule New Class
                </button>
                <button 
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
                onClick={() => navigate("/tutor-enrolled-course-list")} // Redirect to enrolled courses page
            >
                <TrendingUp size={20} className="mr-2" />
                Show All Enrolled Courses
            </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TutorDashboard;