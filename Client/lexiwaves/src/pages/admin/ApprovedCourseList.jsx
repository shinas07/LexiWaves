import React, { useEffect, useState } from "react";
import api from "../../service/api";
import Layout from "./Layout";
import { toast } from "sonner";
import { Loader, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

export default function ApprovedCoursesPage() {
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setErrors] = useState(null);
  const [newRequestsCount, setNewRequestsCount] = useState(0); // State for new requests count
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
        console.log(response.data);
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
        console.log(response.data)
        setNewRequestsCount(response.data.new_course_count); // Assume the response contains a count field
      } catch (error) {
        console.error("Failed to fetch new requests count", error);
      }
    };

    fetchCoursesData();
    fetchNewRequestsCount(); // Fetch new requests count
  }, []);

  const handleDelete = async (courseId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`/lexi-admin/delete-course/${courseId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Course deleted successfully!");
      setCoursesData((prevData) => prevData.filter((course) => course.id !== courseId));
    } catch (error) {
      toast.error("Failed to delete course.");
    }
  };

  const handleViewDetails = (courseId) => {
    navigate(`/courses/${courseId}`); // Navigate to the course details page
  };

  const handleNewCoursesRequestPage = () => {
    navigate('/admin-course-requests'); // Navigate to the new courses page
  };

  return (
    <Layout>
      <div className="flex h-screen font-sans text-white">
        {/* Main Courses Content */}
        <main className="p-6 w-full overflow-auto">
        <div className="flex justify-between items-center mb-6">
            <div className="relative inline-block ml-auto">
                <button
                    onClick={handleNewCoursesRequestPage} 
                    className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                >
                    New Courses for Approval
                </button>
                {newRequestsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {newRequestsCount}
                    </span>
                )}
            </div>


            {/* <div className="flex items-center ml-auto">
                {newRequestsCount > 0 && (
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-full mr-4">
                    {newRequestsCount} New Requests
                </span>
                )}
                <button
                onClick={handleNewCoursesPage} // Call the function to navigate to the new courses page
                className="bg-green-500 text-black px-4 py-2 rounded hover:bg-lightblue-500 transition duration-200"
                >
                New Courses for Approval
                </button>
            </div> */}
        </div>


          <h1 className="text-3xl font-bold mb-6">Approved Courses</h1>

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
                  {coursesData.length > 0 ? (
                    coursesData.map((course) => (
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
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">No approved courses found</td>
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
