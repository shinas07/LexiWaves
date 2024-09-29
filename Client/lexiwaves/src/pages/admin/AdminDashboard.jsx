import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Sample Data for Charts
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];

const userActivityData = [
  { name: 'Mon', active: 3000 },
  { name: 'Tue', active: 3500 },
  { name: 'Wed', active: 4000 },
  { name: 'Thu', active: 3700 },
  { name: 'Fri', active: 4200 },
  { name: 'Sat', active: 3800 },
  { name: 'Sun', active: 3500 },
];

// Simple Bar Chart for Sales Data
const SimpleBarChart = ({ data }) => (
  <div className="flex justify-around items-end h-48">
    {data.map((item, index) => (
      <div key={index} className="flex flex-col items-center">
        <div className="bg-teal-500 w-10" style={{ height: `${item.sales / 100}px` }} />
        <span className="mt-2 text-sm text-gray-300">{item.name}</span>
      </div>
    ))}
  </div>
);

// Simple Line Chart for User Activity
const SimpleLineChart = ({ data }) => (
  <div className="flex justify-around items-end h-48">
    {data.map((item, index) => (
      <div key={index} className="flex flex-col items-center">
        <div className="bg-green-500 w-1" style={{ height: `${item.active / 20}px` }} />
        <span className="mt-2 text-sm text-gray-300">{item.name}</span>
      </div>
    ))}
  </div>
);

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('access');
    console.log('asd')
    localStorage.removeItem('refresh');
    navigate('/admin-login')
  }

  return (
    <div className="flex h-screen font-sans bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className={`bg-gray-800 text-white transition-width duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} overflow-hidden`}>
        <div className="p-5">
          <h2 className={`text-xl font-bold mb-6 ${sidebarOpen ? 'block' : 'hidden'}`}>LexiWaves Admin</h2>
          <nav className='pt-12'>
          <ul>
            {[
                { name: 'Dashboard', link: '/admin-dashboard' },
                { name: 'Courses', link: '/courses' },
                { name: 'Enrolled Courses', link: '/admin/enrolled-courses' },
                { name: 'Students', link: '/admin-students-list' },
                { name: 'Tutors', link: '/admin-tutor-list' },
                { name: 'Languages', link: '/admin-language' },
                // { name: 'Logout', action: Logout }
            ].map((item, index) => (
                <li key={index} className="mb-6">
                <a href={item.link} className="text-gray-300 hover:text-gray-400 flex items-center">
                    <span className={`ml-2 ${sidebarOpen ? 'block' : 'hidden'}`}>{item.name}</span>
                </a>
                </li>
            ))}
            </ul>
            <button className='text-gray-300 hover:text-gray-400 flex items-center pl-2 ' onClick={handleLogout}>Logout</button>

          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 shadow p-4 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl text-gray-200">
            {sidebarOpen ? '⮜' : '☰'}
          </button>
          <input
            type="search"
            placeholder="Search courses, tutors..."
            className="px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-md focus:outline-none focus:border-teal-500"
          />
          <div className="flex items-center space-x-4">
            <button className="text-xl text-gray-300">🔔</button>
            <button className="text-xl text-gray-300">👤</button>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-100">Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              { title: 'Total Revenue', value: '$45,231.89', change: '+20.1% from last month' },
              { title: 'New Students', value: '+2350', change: '+180.1% from last month' },
              { title: 'Active Tutors', value: '+573', change: '+201 since last hour' },
            ].map((item, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-400 mb-2">{item.title}</h3>
                <p className="text-2xl font-bold mb-1 text-teal-400">{item.value}</p>
                <p className="text-xs text-gray-400">{item.change}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-200">Monthly Course Sales</h3>
              <SimpleBarChart data={salesData} />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-200">Student Activity</h3>
              <SimpleLineChart data={userActivityData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
