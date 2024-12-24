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

  useEffect(() => {
    const adminApproved = localStorage.getItem('adminApproved') === 'false';
    if(adminApproved){
      navigate('/waiting-for-approval')
    }
  },[])


  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]); 
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [{
      label: 'Monthly Revenue',
      data: [],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeCourses, setActiveCourses] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        // Fetch student details
        const studentResponse = await api.get('student/students-details/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setData(studentResponse.data); // Setting the response data to state

        // Fetch revenue details
        const revenueResponse = await api.get('tutor/dashboard-details/', { // Adjusted endpoint
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setTotalRevenue(revenueResponse.data.total_revenue); // Set total revenue from response
        setTotalStudents(studentResponse.data.length);
        setActiveCourses(revenueResponse.data.active_courses_count)
        setMonthlyEarnings(revenueResponse.data.monthly_earnings)

        // Prepare revenue chart data
        setRevenueData({
          labels: revenueResponse.data.revenue_labels || [], // Assuming the API returns labels
          datasets: [{
            label: 'Monthly Revenue',
            data: revenueResponse.data.revenue_data || [], // Assuming the API returns revenue data
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        });

      } catch (error) {
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  

  if (loading) {
    return (
      <TutorDashboardLayout>
        <div className="flex justify-center p-12"><Loader/></div>
      </TutorDashboardLayout>
    );
  }

  const stats = [
    { 
      title: "Total Revenue", 
      value: `$${totalRevenue}`, 
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-green-500/10 text-green-500"
    },
    { 
      title: "Total Students", 
      value: totalStudents, 
      icon: <User className="w-6 h-6" />,
      color: "bg-blue-500/10 text-blue-500"
    },
    { 
      title: "Active Courses", 
      value: activeCourses, 
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-purple-500/10 text-purple-500"
    },
    { 
      title: "This Month's Earnings", 
      value: `$${monthlyEarnings}`, // This can also be fetched dynamically if needed
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-orange-500/10 text-orange-500"
    }
  ];

  return (
    <TutorDashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <button 
            onClick={() => navigate("/tutor-create-course")}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Course
          </button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-400" />
              Revenue Overview
            </h2>
            <Line 
              data={revenueData}
              options={{
                responsive: true,
                plugins: {
                  legend: { 
                    position: 'top',
                    labels: { color: '#fff' }
                  }
                },
                scales: {
                  y: { 
                    beginAtZero: true,
                    grid: { color: '#ffffff20' },
                    ticks: { color: '#fff' }
                  },
                  x: {
                    grid: { color: '#ffffff20' },
                    ticks: { color: '#fff' }
                  }
                }
              }}
            />
          </div>

          {/* Recent Students */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-indigo-400" />
              Recent Students
            </h2>
            <div className="space-y-4">
              {data.slice(0, 5).map((student) => (
                <div key={student.id} className="bg-gray-700/50 p-4 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {student.user_first_name} {student.user_last_name}
                      </p>
                      <p className="text-sm text-gray-400">{student.course_title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate("/tutor/students")}
              className="flex items-center justify-center p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors group"
            >
              <User className="w-5 h-5 mr-2 text-indigo-400 group-hover:text-indigo-300" />
              <span className="text-white group-hover:text-gray-200">View Students</span>
            </button>
            <button 
              onClick={() => navigate("/tutor/revenue-report")}
              className="flex items-center justify-center p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors group"
            >
              <DollarSign className="w-5 h-5 mr-2 text-green-400 group-hover:text-green-300" />
              <span className="text-white group-hover:text-gray-200">Revenue Report</span>
            </button>
            <button 
              onClick={() => navigate("/tutor/interaction/student-list")}
              className="flex items-center justify-center p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors group"
            >
              <Mail className="w-5 h-5 mr-2 text-purple-400 group-hover:text-purple-300" />
              <span className="text-white group-hover:text-gray-200">Messages</span>
            </button>
          </div>
        </div>
      </div>
    </TutorDashboardLayout>
  );
};

export default TutorDashboard;