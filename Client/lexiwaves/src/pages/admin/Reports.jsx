import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import api from '../../service/api';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await api.get('/lexi-admin/reports/');
      setReportData(response.data);
    } catch (error) {
      toast.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Admin Reports</h1>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold opacity-80">Total Revenue</h3>
            <p className="text-3xl font-bold">${reportData.financial.total_revenue.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold opacity-80">Monthly Revenue</h3>
            <p className="text-3xl font-bold">${reportData.financial.monthly_revenue.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold opacity-80">Admin Commission</h3>
            <p className="text-3xl font-bold">${reportData.financial.admin_commission.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold opacity-80">Total Enrollments</h3>
            <p className="text-3xl font-bold">{reportData.financial.total_enrollments.toLocaleString()}</p>
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Top Performing Courses</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {reportData.courses.map((course, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{course.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{course.tutor}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{course.enrollments}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${course.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">User Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Students</span>
                <span className="font-bold">{reportData.users.total_students}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Tutors</span>
                <span className="font-bold">{reportData.users.total_tutors}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>New Students (30 days)</span>
                <span className="font-bold">{reportData.users.new_students}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>New Tutors (30 days)</span>
                <span className="font-bold">{reportData.users.new_tutors}</span>
              </div>
            </div>
          </div>

          {/* Payment Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Payment Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Completed Payments</span>
                <span className="font-bold text-green-500">{reportData.payments.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Pending Payments</span>
                <span className="font-bold text-yellow-500">{reportData.payments.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Success Rate</span>
                <span className="font-bold">{reportData.payments.success_rate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}