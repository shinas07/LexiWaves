import React, { useEffect, useState } from "react";
import api from "../../service/api";
import Layout from "./Layout";
import { toast } from "sonner";
import { Loader, AlertTriangle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

export default function ApprovedCoursesPage() {
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setErrors] = useState(null);
  const [newRequestsCount, setNewRequestsCount] = useState(0); // State for new requests count
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get("/lexi-admin/approved-courses/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCoursesData(response.data);
      } catch (error) {
        setErrors("Failed to fetch courses data");
      } finally {
        setLoading(false);
      }
    };

    const fetchNewRequestsCount = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get("/lexi-admin/new-course-count/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNewRequestsCount(response.data.new_course_count); // Assume the response contains a count field
      } catch (error) {
        console.error("Failed to fetch new requests count", error);
      }
    };

    fetchCoursesData();
    fetchNewRequestsCount(); // Fetch new requests count
  }, []);

  useEffect(() => {
    if (!coursesData) return;
    
    const filtered = coursesData.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, coursesData]);

  const handleViewDetails = (courseId) => {
    navigate(`/admin-course-details/${courseId}`);
  };

  const handleNewCoursesRequestPage = () => {
    navigate('/admin-course-requests'); // Navigate to the new courses page
  };

  return (
    <Layout>
      <div className="flex h-screen font-sans text-white">
        <main className="p-6 w-full overflow-auto scrollbar-thin">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">Approved Courses</h1>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              <div className="relative inline-block">
                <button
                  onClick={handleNewCoursesRequestPage}
                  className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600 transition duration-200 whitespace-nowrap text-sm font-medium"
                >
                  New Courses
                </button>
                {newRequestsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {newRequestsCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center h-40">
              <Loader className="animate-spin h-10 w-10 text-indigo-500" />
              <span className="ml-2 text-lg">Loading courses...</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-500 text-white p-4 rounded-lg flex items-center mb-6">
              <AlertTriangle className="mr-2" />
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Title</th>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Category</th>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Duration (hrs)</th>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-700">
                        <td className="px-5 py-5 border-b border-gray-600 text-sm">{course.title}</td>
                        <td className="px-5 py-5 border-b border-gray-600 text-sm">{course.category}</td>
                        <td className="px-5 py-5 border-b border-gray-600 text-sm">{course.price}</td>
                        <td className="px-5 py-5 border-b border-gray-600 text-sm">{course.duration}</td>
                        <td className="px-5 py-5 border-b border-gray-600 text-sm">
                          <button
                            onClick={() => handleViewDetails(course.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 mr-2"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        {searchTerm ? 'No courses found matching your search' : 'No approved courses found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}
