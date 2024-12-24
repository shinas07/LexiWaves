import React, { useEffect, useState } from 'react';
import api from '../../service/api';
import { toast } from 'sonner';
import Layout from './Layout';
import { DollarSign, TrendingUp, Users, Calendar, BookOpen } from 'lucide-react'; // Import icons

const AdminRevenuePage = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await api.get('/lexi-admin/revenue-details', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setRevenueData(response.data);
      } catch (error) {
        toast.error("Failed to fetch revenue data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 mt-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Revenue Overview</h1>
          <p className="text-gray-400 mt-2">Detailed breakdown of course revenues and transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Revenue" 
            value={`$${revenueData.totalRevenue?.toFixed(2) || "0.00"}`}
            icon={<DollarSign className="h-6 w-6" />}
            color="bg-green-500"
          />
          <StatsCard 
            title="Enrolled Courses" 
            value={revenueData.totalEnrollments || "0"}
            icon={<BookOpen className="h-6 w-6" />}
            color="bg-blue-500"
          />
          <StatsCard 
            title="Total Transactions" 
            value={revenueData.totalTransactions || 0}
            icon={<Calendar className="h-6 w-6" />}
            color="bg-purple-500"
          />
          <StatsCard 
            title="Active Students" 
            value={revenueData.totalStudents || 0}
            icon={<Users className="h-6 w-6" />}
            color="bg-orange-500"
          />
        </div>

        {/* Revenue Table */}
        <div className="bg-gray-900 rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Transaction History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Course Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Course Created User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Revenue</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {revenueData.transactions?.length > 0 ? (
                  revenueData.transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {transaction.courseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {transaction.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(transaction.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">
                        ${transaction.revenue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                      No revenue data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color }) => (
  <div className="bg-gray-900 rounded-xl p-6 shadow-xl">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className={`${color} p-3 rounded-lg bg-opacity-20`}>
        {icon}
      </div>
    </div>
  </div>
);

export default AdminRevenuePage;