import React, { useEffect, useState } from 'react';
import api from '../../service/api';
import { Link } from 'react-router-dom';
import Layout from './Layout';

export default function Tutorlist() {
  const [tutorData, setTutorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setErrors] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTutorId, setSelectedTutortId] = useState(null);

  useEffect(() => {
    const fetchTutorsData = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await api.get('/lexi-admin/tutor-list/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTutorsData(response.data);
        setLoading(false);
      } catch (error) {
        setErrors('Failed to fetch tutor data');
        setLoading(false);
      }
    };

    fetchTutorsData();
  }, []);

  const handleBlockClick = (studentId) => {
    setSelectedTutortId(studentId);
    setShowModal(true);
  };
  
  // Actual block function
  const confirmBlock = async () => {
    await handleBlockTutor(selectedTutorId);
    setShowModal(false);
  };
  

  const handleBlockTutor = async (tutorId) => {
    try{
    const token = localStorage.getItem('accessToken')
    await api.post(`/lexi-admin/bldock-student/${tutorId}/`,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    toast.success("Tutor blocked successfully!");
    }catch(error){
      console.error('Failed to block user:', error);
      toast.error("Failed to block Tutor.");
    }

  }

  return (
    <Layout>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-white">Tutors</h1>
        <div className="flex items-center justify-end space-x-4 mb-6">
          <Link to='/admin-tutor-requests' className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md focus:outline-none">
            New Tutor Requests
          </Link>
        </div>

        {/* Loading and Error States */}
        {loading && <p className="text-white">Loading tutors...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">Name</th>
                  <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">Email</th>
                  <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase">Joined</th>
                  <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {tutorData.map((tutor, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="px-5 py-5 border-b border-gray-600 text-sm text-white">{tutor.first_name} {tutor.last_name}</td>
                    <td className="px-5 py-5 border-b border-gray-600 text-sm text-white">{tutor.email}</td>
                    <td className="px-5 py-5 border-b border-gray-600 text-sm text-white">{new Date(tutor.date_joined).toLocaleDateString()}</td>
                    <td className="px-5 py-5 border-b border-gray-600 text-sm">
                    <button onClick={() => handleBlockClick(tutor.id)} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200'>Block</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
          {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-700 rounded-lg p-6 max-w-sm w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Confirm Block</h3>
          <p className="text-whit mb-6">
            Are you sure you want to block this student? This action can be undone later.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-white hover:text-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmBlock}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
            >
              Confirm Block
            </button>
          </div>
        </div>
      </div>
    )}
      </div>
    </Layout>
  );
}