import React, { useEffect, useState } from 'react';
import api from '../../service/api';

const studentsData = [
  { name: 'John Doe', email: 'john@example.com', courses: 5, joined: '2024-01-01' },
  { name: 'Jane Smith', email: 'jane@example.com', courses: 3, joined: '2024-01-10' },
  { name: 'Samuel Green', email: 'samuel@example.com', courses: 2, joined: '2024-02-15' },
  { name: 'Lisa Brown', email: 'lisa@example.com', courses: 4, joined: '2024-03-05' },
];

export default function StudentsPage() {
    const [studentsData, setStudentData] = useState([])
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error,setErrors] = useState(null);

    useEffect(() => {
        const fetchStudentData  = async () => {
            try{
                const response = await api.get('/user/students-list/')
                setStudentData(response.data)
                setLoading(false)
            }catch(error){
                setErrors('Failed to fetch tutor data');
                setLoading(false);
            }
        };
    
        fetchStudentData();
      }, []);

  return (
    <div className="flex h-screen font-sans bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className={`bg-gray-800 transition-width duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} overflow-hidden`}>
        <div className="p-5">
          <h2 className={`text-xl font-bold mb-6 ${sidebarOpen ? 'block' : 'hidden'}`}>AdminPanel</h2>
          <nav>
            <ul>
              {['Dashboard', 'Courses', 'Students', 'Analytics', 'Messages'].map((item, index) => (
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
          <input type="search" placeholder="Search Students..." className="px-4 py-2 border rounded-md focus:outline-none focus:border-indigo-500 bg-gray-700 text-white" />
          <div className="flex items-center space-x-4">
            <button className="text-xl text-white">🔔</button>
            <button className="text-xl text-white">👤</button>
          </div>
        </header>

        {/* Main Student Content */}
        <main className="p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-6">Students</h1>

          {loading && <p>Loading tutors...</p>}
          {error && <p>{error}</p>}


          {!loading && !error && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
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
                {studentsData.map((student, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="px-5 py-5 border-b border-gray-600 text-sm">{student.first_name}</td>
                    <td className="px-5 py-5 border-b border-gray-600 text-sm">{student.email}</td>
                    <td className="px-5 py-5 border-b border-gray-600 text-sm">{student.courses}</td>
                    <td className="px-5 py-5 border-b border-gray-600 text-sm">{student.date_joined}</td>
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
