import React, { useEffect, useState } from 'react';
import api from '../../service/api';
import { toast } from 'sonner';
import { UserIcon, CheckCircleIcon, XCircleIcon, CurrencyDollarIcon, ChevronLeftIcon, ChevronRightIcon, CashIcon } from '@heroicons/react/solid';
import { DotBackground } from '../../components/Background';
import Layout from './Layout';
import Loader from '../Loader';

const EnrolledCoursesList = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
        console.log(response.data)
        setEnrolledCourses(response.data);
      } catch (error) {
        toast.error('Failed to load enrolled courses. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = enrolledCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(enrolledCourses.length / itemsPerPage);

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Calculate admin commission (example: 20% of course price)
  const ADMIN_COMMISSION_PERCENTAGE = 20;
  
  const calculateAdminCommission = (amount) => {
    return (parseFloat(amount) * ADMIN_COMMISSION_PERCENTAGE) / 100;
  };

  // Calculate total admin revenue
  const totalAdminRevenue = enrolledCourses.reduce((acc, curr) => {
    return acc + calculateAdminCommission(curr.amount_paid);
  }, 0);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Enrolled Courses
          </h1>
          <p className="text-gray-400">
            Total Enrollments: {enrolledCourses.length}
          </p>
        </div>

        {/* Updated Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Successful Payments</p>
                <p className="text-white text-2xl font-bold">
                  {enrolledCourses.filter(e => e.payment_status === "completed").length}
                </p>
              </div>
              <CheckCircleIcon className="h-10 w-10 text-white/80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Active Students</p>
                <p className="text-white text-2xl font-bold">
                  {new Set(enrolledCourses.map(e => e.user_first_name + e.user_last_name)).size}
                </p>
              </div>
              <UserIcon className="h-10 w-10 text-white/80" />
            </div>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr className="bg-gray-800/80">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Course Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tutor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Payment Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Admin Revenue</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentItems.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-700 p-2 rounded-full">
                          <UserIcon className="h-5 w-5 text-gray-300" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{enrollment.user_first_name} {enrollment.user_last_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{enrollment.course_title}</p>
                      <p className="text-sm text-gray-400">{enrollment.course_category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{enrollment.course_tutor_name} {enrollment.course_tutor_last_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          {enrollment.payment_status === "completed" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              Pending
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-yellow-400 font-medium">

                          ${enrollment.amount_paid}
                        </div>
                        <div className="text-xs text-gray-400">
                          Tutor Share: ${(parseFloat(enrollment.amount_paid) - calculateAdminCommission(enrollment.amount_paid)).toFixed(2)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-emerald-400 font-medium">
                          <CashIcon className="h-4 w-4 mr-1" />
                          ${calculateAdminCommission(enrollment.amount_paid).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {ADMIN_COMMISSION_PERCENTAGE}% Commission
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(enrollment.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="bg-gray-800/50 px-6 py-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-400">
                <span>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, enrolledCourses.length)} of{' '}
                  {enrolledCourses.length} entries
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* Previous Page Button */}
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg flex items-center ${
                    currentPage === 1
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current page
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`px-3 py-1 rounded-lg ${
                            currentPage === pageNumber
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-700 text-white hover:bg-gray-600'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={pageNumber} className="text-gray-400">...</span>;
                    }
                  })}
                </div>

                {/* Next Page Button */}
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg flex items-center ${
                    currentPage === totalPages
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EnrolledCoursesList;