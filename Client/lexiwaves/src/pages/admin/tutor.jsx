import React, { useEffect, useState } from 'react';
import api from '../../service/api';
import { Link } from 'react-router-dom';

export default function Tutorlist() {
  const [tutorData, setTutorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setErrors] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchTutorsData = async () => {
      try {
        const response = await api.get('/tutor/tutor-list/');
        setTutorsData(response.data);
        setLoading(false);
      } catch (error) {
        setErrors('Failed to fetch tutor data');
        setLoading(false);
      }
    };

    fetchTutorsData();
  }, []);

  return (
    <div className="flex h-screen font-sans bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className={`bg-gray-800 transition-width duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} overflow-hidden`}>
        <div className="p-5">
          <h2 className={`text-xl font-bold mb-6 ${sidebarOpen ? 'block' : 'hidden'}`}>AdminPanel</h2>
          <nav>
            <ul>
              {['Dashboard', 'Courses', 'Students', 'Tutors', 'Analytics', 'Messages'].map((item, index) => (
                <li key={index} className="mb-6">
                  <a href="#" className="text-white hover:text-gray-300 flex items-center">
                    <span className={`ml-2 ${sidebarOpen ? 'block' : 'hidden'}`}>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 shadow p-4 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl text-white">
            {sidebarOpen ? '⮜' : '☰'}
          </button>
          <div className="flex items-center ml-2 space-x-4">
            <input type="search" placeholder="Search Tutors..." className="px-4 py-2 border rounded-md focus:outline-none focus:border-indigo-500 bg-gray-700 text-white" />
            <button className="text-xl text-white">🔔</button>
            <button className="text-xl text-white">👤</button>
          </div>
        </header>

        {/* Main Tutor Content */}
        <main className="p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-6">Tutors</h1>
          <div className="flex items-center justify-end space-x-4">
            <Link to='/tutor-reqeusts' className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md focus:outline-none">
              New Tutor Requests
            </Link>
        </div>

          {/* Loading and Error States */}
          {loading && <p>Loading tutors...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && (
            <div className="bg-gray-800 p-4 mt-8 rounded-lg shadow-md">
              {/* Tutor Table */}
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">Name</th>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">Email</th>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">Courses</th>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {tutorData.map((tutor, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="px-5 py-5 border-b border-gray-600 text-sm">{tutor.firstname}</td>
                      <td className="px-5 py-5 border-b border-gray-600 text-sm">{tutor.email}</td>
                      <td className="px-5 py-5 border-b border-gray-600 text-sm">{tutor.courses}</td>
                      <td className="px-5 py-5 border-b border-gray-600 text-sm">{tutor.date_joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
