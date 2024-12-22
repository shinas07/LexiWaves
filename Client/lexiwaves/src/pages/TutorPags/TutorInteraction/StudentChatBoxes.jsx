import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../../service/api';
import {
  MessageCircle,
  ArrowLeft,
  Book,
  Clock,
  Calendar,
  Video
} from 'lucide-react';
import TutorDashboardLayout from '../TutorDashboardLayout';

const StudentCourseChats = () => {
  const [courses, setCourses] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoRequests, setVideoRequests] = useState([]);
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStudentAndCourses();
    fetchVideoRequests();
  }, [studentId]);

  const fetchStudentAndCourses = async () => {
    try {
     
     const token = localStorage.getItem('accessToken')
      const response = await api.get(`interaction/chat-boxes/${studentId}/`,{
        headers: {
            Authorization: `Bearer ${token}`
        }

      });
      setStudent(response.data.student);
      setCourses(response.data.courses);
    } catch (error) {
      toast.error('Failed to load student chatbox');
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (course) => {
    navigate(`/tutor/chat/${course.room_id}`);
  };

  // const handleVideoRequest = async (requestId, action) => {
  //   try {
  //     const response = await api.post(`/video-call/handle-request/${requestId}/`, {
  //       action: action // 'accept' or 'decline'
  //     });
      
  //     // Refresh video requests after action
  //     fetchStudentAndCourses();
  //     toast.success(`Video call request ${action}ed successfully`);
  //   } catch (error) {
  //     toast.error(`Failed to ${action} video call request`);
  //   }
  // };

  const fetchVideoRequests = async () => {
    try{

      const response = await api.get(`/video-call/student-requests/${studentId}/`,
     
      );
      setVideoRequests(response.data.requests);
    }catch(error){
      toast.error('Error fecthing Video request')
    }
  }

  const filteredCourses = courses
    .sort((a, b) => {
      // First sort by latest request time
      const aLatestRequest = videoRequests
        .filter(r => r.course === a.id)
        .sort((r1, r2) => new Date(r2.created_at) - new Date(r1.created_at))[0];
      
      const bLatestRequest = videoRequests
        .filter(r => r.course === b.id)
        .sort((r1, r2) => new Date(r2.created_at) - new Date(r1.created_at))[0];

      if (aLatestRequest && bLatestRequest) {
        return new Date(bLatestRequest.created_at) - new Date(aLatestRequest.created_at);
      }
      if (aLatestRequest) return -1;
      if (bLatestRequest) return 1;

      // If no requests, sort by latest_request_time from backend
      if (a.latest_request_time && b.latest_request_time) {
        return new Date(b.latest_request_time) - new Date(a.latest_request_time);
      }
      
      // Finally, sort by course creation date
      return new Date(b.created_at) - new Date(a.created_at);
    })
    .filter(course => 
      course.course_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleVideoCallClick = (courseId) => {
    navigate(`/tutor/video-call-request/${studentId}/${courseId}`);
  };


  return (
    <TutorDashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">

        {/* Header with Search */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/tutor/interaction/student-list')}
              className="p-2 rounded-full hover:bg-gray-700 text-gray-400"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            {student && (
              <h1 className="text-2xl font-bold text-white">
                Interactions with {student.name}
              </h1>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 
                         border border-gray-700 focus:border-blue-500 focus:ring-1 
                         focus:ring-blue-500 outline-none transition-colors text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>



        {/* Course Sections */}
        <div className="space-y-8">
          {filteredCourses.map((course) => {
            const courseRequests = videoRequests.filter(
              request => request.course === course.id
            );

            return (
              <div key={course.id} className="bg-gray-900 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Course Title: {course.course_name}
                </h2> 
                
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Course Chat Card */}
                  <div
                    className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors cursor-pointer flex flex-col justify-center items-center h-full"
                    onClick={() => handleChatClick(course)}
                  >
                    <div className="flex flex-col items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <MessageCircle className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-white">Chat Room</h3>
                        <p className="text-sm text-gray-400">
                          {course.total_messages} messages
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-400">
                      {course.last_message_date && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            Last activity: {new Date(course.last_message_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Video Calls Section */}
                  <div 
                    className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => handleVideoCallClick(course.id)}
                  >
                    <div className="flex items-center  gap-3 mb-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Video className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Video Calls</h3>
                        <p className="text-sm text-gray-400">
                          {courseRequests.length} requests
                        </p>
                      </div>
                    </div>

                    {courseRequests.length > 0 && (
                      <div className="space-y-3">
                        {courseRequests.slice(0, 2).map((request) => (
                          <div 
                            key={request.id} 
                            className={`p-3 rounded-lg border-l-4 ${
                              request.status === 'pending' ? 'border-yellow-500 bg-gray-700' :
                              request.status === 'accepted' ? 'border-green-500 bg-gray-700/50' :
                              'border-red-500 bg-gray-700/30'
                            }`}
                          >
                            <div>
                              <p className="text-sm text-gray-300">
                                Status: <span className="capitalize">{request.status}</span>
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(request.created_at).toLocaleString(undefined, { 
                                  dateStyle: 'medium', 
                                  timeStyle: 'short' 
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                        {courseRequests.length > 2 && (
                          <p className="text-sm text-gray-400 text-center">
                            +{courseRequests.length - 2} more requests
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No Interactions Found
            </h3>
            <p className="text-gray-400">
              There are no active courses with this student.
            </p>
          </div>
        )}
      </div>
    </TutorDashboardLayout>
  );
};

export default StudentCourseChats;