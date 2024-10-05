import React, { useEffect, useState } from 'react';
import api from '../../service/api';
import { toast } from 'sonner';
import { UserIcon, CheckCircleIcon, XCircleIcon, CurrencyDollarIcon } from '@heroicons/react/solid';
import { DotBackground } from '../../components/Background';

const EnrolledCoursesList = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          toast.error('Access token is missing. Please log in again.');
          return;
        }

        const response = await api.get('/lexi-admin/enrolled-courses/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setEnrolledCourses(response.data);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        toast.error('Failed to load enrolled courses. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(enrolledCourses)

  return (
    <DotBackground>
      <div className="mt-16 text-sm max-w-6xl mx-auto p-6">
        <h1 className="text-5xl font-extrabold mb-12 text-center text-white">Enrolled Courses</h1>

        {/* Table Container */}
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-gray-900 text-white rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                <th className="py-3 px-4 text-left text-lg font-semibold">Student Name</th>
                <th className="py-3 px-4 text-left text-lg font-semibold">Course Title</th>
                <th className="py-3 px-4 text-left text-lg font-semibold">Category</th>
                <th className="py-3 px-4 text-left text-lg font-semibold">Tutor Name</th>
                <th className="py-3 px-4 text-left text-lg font-semibold">Payment Status</th>
                <th className="py-3 px-4 text-left text-lg font-semibold">Amount Paid</th>
                <th className="py-3 px-4 text-left text-lg font-semibold">Enrollment Date</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800">
              {enrolledCourses.map((enrollment) => (
                <tr key={enrollment.id} className="even:bg-gray-700 hover:bg-gray-600 transition-colors duration-200">
                  <td className="py-4 px-6 flex items-center">
                    <UserIcon className="h-6 w-6 text-gray-400 mr-2" />
                    <span>{enrollment.user_first_name} {enrollment.user_last_name}</span>
                  </td>
                  <td className="py-4 px-6">{enrollment.course_title}</td>
                  <td className="py-4 px-6">{enrollment.course_category}</td>
                  <td className="py-4 px-6">{enrollment.course_tutor_name} {enrollment.course_tutor_last_name}</td>
                  <td className="py-4 px-6">
                    {enrollment.payment_status === "pending" ? (
                      <span className="flex items-center text-green-400">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Successful
                      </span>
                    ) : (
                      <span className="flex items-center text-red-400">
                        <XCircleIcon className="h-5 w-5 mr-2" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 text-yellow-400 mr-2" />
                    <span>${enrollment.amount_paid}</span>
                  </td>
                  <td className="py-4 px-6">
                    {new Date(enrollment.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DotBackground>
  );
};

export default EnrolledCoursesList;