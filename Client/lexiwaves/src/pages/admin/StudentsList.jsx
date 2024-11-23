import React, { useEffect, useState } from "react";
import api from "../../service/api";
import Layout from "./Layout";
import { toast } from "sonner";
import { Loader, AlertTriangle } from "lucide-react"; // Make sure to install lucide-react

export default function StudentsPage() {
  const [studentsData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setErrors] = useState(null);
  const [showModal, setShowModal] = useState(false);
const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get("/lexi-admin/students-list/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudentData(response.data);
      } catch (error) {
        setErrors("Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleBlockClick = (studentId) => {
    setSelectedStudentId(studentId);
    setShowModal(true);
  };

  const confirmBlock = async () => {
    await handleBlock(selectedStudentId);
    setShowModal(false);
  };

  const handleBlock = async (studentId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.post(`/lexi-admin/block-student/${studentId}/`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success("Student blocked successfully!");
      // Optionally, refresh the student data
      setStudentData((prevData) => prevData.filter((student) => student.id !== studentId));
    } catch (error) {
      toast.error("Failed to block student.");
    }
  };

  return (
    <Layout>
      <div className="flex h-screen font-sans text-white ">
        {/* Main Student Content */}
        <main className="p-6 w-full overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Students</h1>

          {loading && (
            <div className="flex items-center justify-center h-40">
              <Loader className="animate-spin h-10 w-10 text-indigo-500" />
              <span className="ml-2 text-lg">Loading students...</span>
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
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Joined</th>
                    <th className="px-5 py-3 border-b border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsData.length > 0 ? (
                    studentsData.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-700">
                        <td className="px-5 py-5 border-b border-gray-600 text-sm">{`${student.first_name} ${student.last_name}`}</td>
                        <td className="px-5 py-5 border-b border-gray-600 text-sm">{student.email}</td>
                        <td className="px-5 py-5 border-b border-gray-600 text-sm">{new Date(student.date_joined).toLocaleDateString()}</td>
                        <td className="px-5 py-5 border-b border-gray-600 text-sm">
                          <button
                            onClick={() => handleBlockClick(student.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
                          >
                            Block
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">No students found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
           {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-gray-700 rounded-lg p-6 max-w-sm w-full mx-4">
                    <h3 className="text-lg font-semibold mb-4">Confirm Block</h3>
                    <p className=" text-white mb-6">
                      Are you sure you want to block this student?
                    </p>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 text-white py-2 text-gray-600 hover:text-gray-400 transition duration-200"
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
        </main>
      </div>
    </Layout>
  );
}
