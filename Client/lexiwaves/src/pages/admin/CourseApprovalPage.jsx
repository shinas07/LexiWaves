// NewCoursesPage.js

import React, { useEffect, useState } from "react";
import api from "../../service/api";
import Layout from "./Layout";
import { toast } from "sonner";
import { Loader, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom"; 


export default function CourseApprovingPage() {
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setErrors] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get("/lexi-admin/admin-courses-request/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCoursesData(response.data);
      } catch (error) {
        setErrors("Failed to fetch new courses data");
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesData();
  }, []);

  const handleUpdateApproval = async (courseId, isApproved) => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.patch(`/lexi-admin/course-approval/${courseId}/`, {
        is_approved: !isApproved,  // Toggle approval status
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Course approval status updated!");
      setCoursesData((prevData) =>
        prevData.map((course) =>
          course.id === courseId ? { ...course, is_approved: !isApproved } : course
        )
      );
    } catch (error) {
      toast.error("Failed to update course approval status.");
    }
  };

  // New function to handle navigation to course details page
  const handleViewDetails = (courseId) => {
    navigate(`/admin-course-details/${courseId}`); // Adjust this to match your route for course details
  };

  return (
    <Layout>
      <div className="flex h-screen font-sans text-white">
        <main className="p-6 w-full overflow-auto scrollbar-thin">
          <h1 className="text-3xl font-bold mb-6">New Courses for Approval</h1>

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
                        <td className="px-5 py-5 border-b border-gray-600 text-sm flex space-x-2">
                          <button
                            onClick={() => handleUpdateApproval(course.id, course.is_approved)}
                            className={`px-4 py-2 rounded transition duration-200 ${course.is_approved ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
                          >
                            {course.is_approved ? 'Decline' : 'Approve'}
                          </button>
                          {/* New button for viewing course details */}
                          <button
                            onClick={() => handleViewDetails(course.id)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded transition duration-200"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5">No new courses found.</td>
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
