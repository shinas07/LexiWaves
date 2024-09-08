import React from 'react';
import { Link } from 'react-router-dom';

const TutorDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex-shrink-0">
        <div className="p-4 text-center font-semibold text-lg">Tutor Dashboard</div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link to="/dashboard" className="block py-2 px-4 hover:bg-blue-700">Dashboard</Link>
            </li>
            <li>
              <Link to="/my-courses" className="block py-2 px-4 hover:bg-blue-700">My Courses</Link>
            </li>
            <li>
              <Link to="/messages" className="block py-2 px-4 hover:bg-blue-700">Student Messages</Link>
            </li>
            <li>
              <Link to="/schedule" className="block py-2 px-4 hover:bg-blue-700">Schedule</Link>
            </li>
            <li>
              <Link to="/earnings" className="block py-2 px-4 hover:bg-blue-700">Earnings</Link>
            </li>
            <li>
              <Link to="/settings" className="block py-2 px-4 hover:bg-blue-700">Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Welcome, Tutor Name</div>
          <div className="flex items-center space-x-4">
            <img src="profile-pic-url" alt="Profile" className="w-10 h-10 rounded-full" />
            <button className="bg-blue-500 text-white py-2 px-4 rounded">Account</button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card Example */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">My Courses</h2>
              <p className="mt-2">Overview of your courses and progress.</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">Student Messages</h2>
              <p className="mt-2">View and respond to student messages.</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">Schedule</h2>
              <p className="mt-2">Manage your teaching schedule.</p>
            </div>
            {/* Add more cards as needed */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TutorDashboard;
