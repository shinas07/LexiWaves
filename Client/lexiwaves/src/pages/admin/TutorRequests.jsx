import React, { useEffect, useState } from 'react';
import api from '../../service/api';
import { useNavigate } from 'react-router-dom';


export default function TutorRequests() {
  const [requestsData, setRequestsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequestsData = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await api.get('/lexi-admin/tutor-requests/',{
          headers: {
            Authorization: `Bearer ${token}`, 
          },
      });
        setRequestsData(response.data);
      
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch tutor requests');
        setLoading(false);
      }
    };

    fetchRequestsData();
  }, []);

  const handleDetails = (id) => {
    navigate(`/admin-tutor-details/${id}`)

  };

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
                  <a href="/admin-dashboard" className="text-white hover:text-gray-300 flex items-center">
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
          <input type="search" placeholder="Search Requests..." className="px-4 py-2 border rounded-md focus:outline-none focus:border-indigo-500 bg-gray-700 text-white" />
          <div className="flex items-center space-x-4">

            <button className="text-xl text-white">🔔</button>
            <button className="text-xl text-white">👤</button>
          </div>
        </header>

        {/* Main Tutor Requests Content */}
        <main className="p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-6">Tutor Requests</h1>

          {/* Loading and Error States */}
          {loading && <p>Loading requests...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              {/* Tutor Requests Table */}
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">id</th>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">Name</th>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">Email</th>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">Joined Data</th>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requestsData.map((request, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="px-5 py-5 border-b border-gray-600 text-sm">{request.id}</td>
                      <td className="px-5 py-5 border-b border-gray-600 text-sm">{request.first_name}</td>
                      <td className="px-5 py-5 border-b border-gray-600 text-sm">{request.email}</td>
                      <td className="px-5 py-5 border-b border-gray-600 text-sm">{request.date_joined
                      }</td>
                      <td className="px-5 py-5 border-b border-gray-600 text-sm flex space-x-2">
                        <button onClick={() => handleDetails(request.id)}
                        className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md focus:outline-none'>
                          Details
                        </button>
                      </td>
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
