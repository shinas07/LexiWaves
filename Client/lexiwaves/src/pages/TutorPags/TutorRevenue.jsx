import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../service/api';
import TutorDashboardLayout from './TutorDashboardLayout';
import { DollarSign, BookOpen, Users, TrendingUp } from 'lucide-react';
import Loader from '../Loader';

export default function TutorRevenue() {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState(null);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const response = await api.get('/tutor/revenue-details/');
      setRevenueData(response.data);
    } catch (error) {
      toast.error('Failed to fetch revenue data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <TutorDashboardLayout>
        <div className="flex justify-center items-center h-screen">
         <Loader/>
        </div>
      </TutorDashboardLayout>
    );
  }

    if (!revenueData) {
        return (
          <TutorDashboardLayout>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-white">Revenue Overview</h1>
              <p className="text-gray-300">No revenue data available.</p>
            </div>
          </TutorDashboardLayout>
        );
      }
    

  return (
    <TutorDashboardLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Revenue Overview</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value={`$${revenueData.summary.total_revenue.toLocaleString()}`}
            icon={<DollarSign />}
            color="bg-green-500"
          />
          <StatsCard
            title="Monthly Revenue"
            value={`$${revenueData.summary.monthly_revenue.toLocaleString()}`}
            icon={<TrendingUp />}
            color="bg-blue-500"
          />
          <StatsCard
            title="Total Courses"
            value={revenueData.summary.total_courses}
            icon={<BookOpen />}
            color="bg-purple-500"
          />
          <StatsCard
            title="Total Enrollments"
            value={revenueData.summary.total_enrollments}
            icon={<Users />}
            color="bg-orange-500"
          />
          
        </div>

        {/* Course Revenue Table */}
        <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white">Course Revenue</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Enrollments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Admin Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {revenueData.courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{course.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${course.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.enrollments}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">${course.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${course.admin_commission.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {revenueData.recent_transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{tx.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{tx.course_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">${tx.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TutorDashboardLayout>
  );
}

const StatsCard = ({ title, value, icon, color }) => (
  <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      <div className={`${color} p-3 rounded-lg bg-opacity-20`}>
        {icon}
      </div>
    </div>
  </div>
);