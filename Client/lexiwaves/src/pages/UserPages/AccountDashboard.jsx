import React, { useEffect } from "react";
import UserDashboardLayout from "./DashboardLayout";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  ChevronRight, 
  Bookmark,
  GraduationCap,
  PlayCircle,
  Target,
  Calendar
} from 'lucide-react';
import StudyStreak from "./StudyStreak";
import { toast } from "sonner";
import { set } from "date-fns";
import Loader from "../Loader";
import api from '../../service/api';
import { useState } from "react";

const AccountDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      enrolled_count: 0,
      completed_count: 0,
      study_hours: 0,
      certificates: 0
    },
    recent_courses: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/student/dashboard-stats/');
        if (response.data.status === 'success') {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <UserDashboardLayout>
        <Loader />
      </UserDashboardLayout>
    );
  }

  const stats = [
    {
      title: "Enrolled Courses",
      value: dashboardData.stats.enrolled_count,
      icon: <BookOpen className="w-6 h-6 text-blue-400" />,
      color: "from-blue-500/20 to-transparent"
    },
    // {
    //   title: "Hours Learned",
    //   value: dashboardData.stats.study_hours,
    //   icon: <Clock className="w-6 h-6 text-purple-400" />,
    //   color: "from-purple-500/20 to-transparent"
    // },
    {
      title: "Certificates Earned",
      value: dashboardData.stats.certificates,
      icon: <Award className="w-6 h-6 text-yellow-400" />,
      color: "from-yellow-500/20 to-transparent"
    }
  ];

  return (
    <UserDashboardLayout>
      <div className="container mx-auto p-6 space-y-6 mt-12">
        <StudyStreak/>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 relative overflow-hidden group hover:bg-gray-800/70 transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-20`} />
              <div className="relative">
                <div className="p-2 bg-gray-700/50 rounded-xl w-fit">
                  {stat.icon}
                </div>
                <h3 className="text-gray-400 text-sm font-medium mt-4">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-white mt-2">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-blue-400" />
                  Recent Courses
                </h2>
                <Link 
                  to="/enrolled-courses"
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.recent_courses.length > 0 ? (
                  dashboardData.recent_courses.map((course, index) => (
                    <div key={index} className="bg-gray-700/30 rounded-xl p-4 hover:bg-gray-700/50 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-medium">{course.name}</h3>
                          <p className="text-gray-400 text-sm mt-1">Next: {course.desc}</p>
                          <p className="text-gray-500 text-xs mt-2">
                            Instructor: {course.instructor}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">${course.amount_paid}</div>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(course.lastAccessed).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                     
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No courses enrolled yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Link 
            to="/courses"
            className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-6 rounded-2xl hover:from-blue-500/30 hover:to-indigo-500/30 transition-all group"
          >
            <BookOpen className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-medium mt-4">Browse Courses</h3>
            <p className="text-gray-400 text-sm mt-1">Discover new learning opportunities</p>
          </Link>
          
          <Link 
            to="/enrolled-courses"
            className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 p-6 rounded-2xl hover:from-purple-500/30 hover:to-violet-500/30 transition-all group"
          >
            <BookOpen className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-medium mt-4">Enrolled Courses</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-purple-400 font-semibold">{dashboardData.stats.enrolled_count}</span>
              <p className="text-gray-400 text-sm">Active Courses</p>
            </div>
          </Link>
          
          <Link 
            to="/certificates"
            className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-2xl hover:from-green-500/30 hover:to-emerald-500/30 transition-all group"
          >
            <Award className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-medium mt-4">Certificates</h3>
            <p className="text-gray-400 text-sm mt-1">View your earned certificates</p>
          </Link>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default AccountDashboard;