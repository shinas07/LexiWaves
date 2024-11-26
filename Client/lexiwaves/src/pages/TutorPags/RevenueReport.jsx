import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../../service/api';  // Assuming you're using axios for API calls
import TutorDashboardLayout from './TutorDashboardLayout';

// Registering chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RevenueReport = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get('tutor/revenue-report/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setRevenueData(response.data.revenue_report);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-12">Loading...</div>;
  }

  // Data for the line chart
  const chartData = {
    labels: revenueData.map(course => course.course_title),
    datasets: [
      {
        label: 'Total Revenue',
        data: revenueData.map(course => course.total_revenue),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      }
    ]
  };

  return (
    <TutorDashboardLayout>
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">Revenue Report</h1>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Revenue Overview</h2>
        <Line 
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Course Revenue Report' }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }}
        />
      </div>

      {/* Course Revenue Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Course Revenue Details</h2>
        <table className="min-w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Course Title</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Students Enrolled</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Course Price</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.map(course => (
              <tr key={course.course_title} className="border-b dark:border-gray-700">
                <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{course.course_title}</td>
                <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{course.students_enrolled}</td>
                <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
  ${course.course_price.toLocaleString('en-IN', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
</td>
<td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
  ${course.total_revenue.toLocaleString('en-IN', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </TutorDashboardLayout>
  );
};

export default RevenueReport;
