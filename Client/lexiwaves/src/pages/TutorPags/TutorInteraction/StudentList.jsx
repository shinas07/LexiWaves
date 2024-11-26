import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../../service/api';
import {
  MessageCircle,
  Video,
  Search,
  Calendar,
  MoreVertical,
  Clock
} from 'lucide-react';
import Loader from '../../Loader';
import TutorDashboardLayout from '../TutorDashboardLayout';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('interaction/students/list/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const formattedStudents = response.data.map(student => ({
        id: student.id,
        name: student.student_name,
        email: student.student_email,
        lastActive: 'Recently',
        isOnline: false,
        hasUnreadMessages: true
      }));
      
      setStudents(formattedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = (studentId) => {
    navigate(`/tutor/students/course-chats/${studentId}`);
  };

  const handleVideoCallRequest = async (studentId) => {
    try {
      await api.post(`/video-call/request/${studentId}`);
      toast.success('Video call request sent successfully');
    } catch (error) {
      toast.error('Failed to send video call request');
    }
  };

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (student.name && student.name.toLowerCase().includes(searchLower)) ||
      (student.email && student.email.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
        <TutorDashboardLayout>
            <Loader />
        </TutorDashboardLayout>
    );
}


  return (
    <TutorDashboardLayout>
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Enrolled Students</h1>
        <p className="text-gray-400">Manage your student interactions and communications</p>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Last Active</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {student.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-medium text-white">{student.name}</div>
                          <div className="text-sm text-gray-400">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="h-4 w-4" />
                        {student.lastActive}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.isOnline 
                          ? 'bg-green-500/10 text-green-400' 
                          : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {student.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleMessageClick(student.id)}
                          className="p-2 rounded-full hover:bg-gray-600 text-gray-300 hover:text-white transition-colors relative"
                        >
                          <MessageCircle className="h-5 w-5" />
                          {student.hasUnreadMessages && (
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full" />
                          )}
                        </button>
                        <button
                          onClick={() => handleVideoCallRequest(student.id)}
                          className="p-2 rounded-full hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                        >
                          <Video className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No students found matching your search.
          </div>
        )}
      </div>
    </div>
    </TutorDashboardLayout>
  );
};

export default StudentsList;