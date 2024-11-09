import React, { useEffect, useState } from 'react';
import api from '../../service/api';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';


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
    <Layout>
    <div className="flex h-screen font-sanstext-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Main Tutor Requests Content */}
        <main className="p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-6">Tutor Requests</h1>

          {/* Loading, Error, and No Requests States */}
            {loading && <p>Loading requests...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && requestsData.length === 0 && (
    <div className="flex items-center justify-center p-6 mt-4 rounded-lg shadow-lg text-center text-gray-300">
      <p className="text-lg font-semibold text-gray-400">No new tutor requests available at the moment.</p>
    </div>
  )}

            {!loading && !error && requestsData.length > 0 && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                {/* Tutor Requests Table */}
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">ID</th>
                      <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">Name</th>
                      <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">Email</th>
                      <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">Joined Date</th>
                      <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestsData.map((request, index) => (
                      <tr key={index} className="hover:bg-gray-700">
                        <td className="px-5 py-5 border-b border-gray-600 text-sm">{request.id}</td>
                        <td className="px-5 py-5 border-b border-gray-600 text-sm">{request.first_name}</td>
                        <td className="px-5 py-5 border-b border-gray-600 text-sm">{request.email}</td>
                        <td className="px-5 py-5 border-b border-gray-600 text-sm">{request.date_joined}</td>
                        <td className="px-5 py-5 border-b border-gray-600 text-sm flex space-x-2">
                          <button
                            onClick={() => handleDetails(request.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md focus:outline-none"
                          >
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
    </Layout>
  );
}
