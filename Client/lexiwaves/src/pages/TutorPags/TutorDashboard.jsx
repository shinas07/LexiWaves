import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  User,
  Mail,
  TrendingUp,
  Plus,
  Calendar,
  DollarSign
} from 'lucide-react';
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
import api from '../../service/api';
import TutorDashboardLayout from './TutorDashboardLayout';
import { toast } from 'sonner';
import Loader from '../Loader';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TutorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]); // To store student data
  const [revenueData, setRevenueData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Revenue',
      data: [500, 1200, 900, 1600, 2000, 1800],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  });

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get('student/students-details/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setData(response.data); // Setting the response data to state
      
      } catch {
        toast.error('Faild to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchStudentDetails();
  }, []);

  if (loading) {
    return(
    <TutorDashboardLayout>
    <div className="flex justify-center p-12"><Loader/></div>;
    </TutorDashboardLayout>
    )
  }

  return (
    <TutorDashboardLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">Dashboard Overview</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-600 bg-opacity-75">
                <DollarSign size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-lg font-semibold text-gray-700 dark:text-white">$8,200</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart and Recent Students */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Revenue Overview</h2>
            <Line 
              data={revenueData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Monthly Revenue' }
                },
                scales: { y: { beginAtZero: true } }
              }}
            />
          </div>

          {/* Recent Students */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Students</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Course</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Course Category</th> {/* Replaced Progress */}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((student) => (  // Showing only 5 students as an example
                    <tr key={student.id} className="border-b dark:border-gray-700">
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{student.user_first_name} {student.user_last_name}</td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{student.course_title}</td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{student.course_category || 'N/A'}</td> {/* Displaying account status or fallback */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => navigate("/tutor-create-course")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
              >
                <Plus size={20} className="mr-2" />
                Create New Course
              </button>
              <button 
                onClick={() => navigate("/tutor/students")}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
              >
                <User size={20} className="mr-2" />
                View All Students
              </button>
              <button 
                onClick={() => navigate("/tutor/revenue-report")}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
              >
                <DollarSign size={20} className="mr-2" />
                Revenue Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </TutorDashboardLayout>
  );
};

export default TutorDashboard;
