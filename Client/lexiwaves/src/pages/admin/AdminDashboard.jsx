import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import Layout from './Layout';
import api from '../../service/api';
import { Loader } from 'lucide-react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalStudents: 0,
    totalTutors: 0,
    totalCourses: 0,
  });

  const [revenueData, setRevenueData] = useState([
    { month: 'Jan', totalRevenue: 4000, adminRevenue: 1000, tutorRevenue: 3000 },
    { month: 'Feb', totalRevenue: 5000, adminRevenue: 1250, tutorRevenue: 3750 },
    { month: 'Mar', totalRevenue: 6000, adminRevenue: 1500, tutorRevenue: 4500 },
    { month: 'Apr', totalRevenue: 7000, adminRevenue: 1750, tutorRevenue: 5250 },
    { month: 'May', totalRevenue: 8000, adminRevenue: 2000, tutorRevenue: 6000 },
    { month: 'Jun', totalRevenue: 9000, adminRevenue: 2250, tutorRevenue: 6750 },
  ]);

  const [enrollmentData, setEnrollmentData] = useState([
    { course: 'English Basic', students: 120, completionRate: 85 },
    { course: 'French A1', students: 90, completionRate: 78 },
    { course: 'German Basic', students: 75, completionRate: 82 },
    { course: 'English Advanced', students: 60, completionRate: 90 },
    { course: 'Spanish Basic', students: 45, completionRate: 75 },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/lexi-admin/dashboard-view/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
      setRevenueData(response.data.revenueData);
      setEnrollmentData(response.data.enrollmentData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      
      <div className="p-6  min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: 'Total Revenue',
                value: `$${stats.totalRevenue.toLocaleString()}`,
                bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600'
              },
              {
                title: 'Total Students',
                value: stats.totalStudents.toLocaleString(),
                bgColor: 'bg-gradient-to-r from-green-500 to-green-600'
              },
              {
                title: 'Active Tutors',
                value: stats.totalTutors.toLocaleString(),
                bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600'
              },
              {
                title: 'Total Courses',
                value: stats.totalCourses.toLocaleString(),
                bgColor: 'bg-gradient-to-r from-orange-500 to-orange-600'
              }
            ].map((stat, index) => (
              <div
                key={index}
                className={`${stat.bgColor} rounded-xl shadow-lg p-6`}
              >
                <h3 className="text-white text-sm font-medium opacity-80">{stat.title}</h3>
                <p className="text-white text-3xl font-bold mt-2">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
              Revenue Overview
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="totalRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="adminRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="totalRevenue" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#totalRevenue)" 
                  name="Total Revenue"
                />
                <Area 
                  type="monotone" 
                  dataKey="adminRevenue" 
                  stroke="#82ca9d" 
                  fillOpacity={1} 
                  fill="url(#adminRevenue)" 
                  name="Admin Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Course Enrollment Chart - Updated Version */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Top 10 Course Enrollments
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart 
                data={enrollmentData.slice(0, 10)} 
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="course" 
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="students" 
                  name="Total Enrolled"
                  fill="#8884d8"
                  radius={[0, 4, 4, 0]}
                >
                  {/* Add value labels at the end of each bar */}
                  {enrollmentData.slice(0, 10).map((entry, index) => (
                    <text
                      key={index}
                      x={entry.students + 5}
                      y={index * 40 + 20}
                      fill="#666"
                      fontSize={12}
                      textAnchor="start"
                      dominantBaseline="middle"
                    >
                      {entry.students}
                    </text>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}