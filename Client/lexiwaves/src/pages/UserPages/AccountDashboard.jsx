import React from "react";
import UserDashboardLayout from "./DashboardLayout";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Award, TrendingUp, ChevronRight } from 'lucide-react';

const AccountDashboard = () => {
  // Mock data - replace with actual data from your backend
  const currentCourse = {
    name: "Advanced English Conversation",
    progress: 65,
    nextLesson: "Idiomatic Expressions"
  };

  const stats = [
    { label: "Courses Enrolled", value: 10, icon: <BookOpen className="h-6 w-6 text-blue-500" /> },
    { label: "Lessons Completed", value: 48, icon: <Clock className="h-6 w-6 text-green-500" /> },
    { label: "Study Streak", value: "7 days", icon: <Award className="h-6 w-6 text-yellow-500" /> },
  ];

  const upcomingLessons = [
    { name: "Business English", time: "Tomorrow, 3:00 PM" },
    { name: "Grammar Workshop", time: "Friday, 5:00 PM" },
  ];

  return (
    <UserDashboardLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Welcome back, Learner!</h1>
        
        {/* Current Course Progress */}
        <div className="bg-white dark:bg-neutral-800 overflow-hidden shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{currentCourse.name}</h2>
            <div className="mt-1 relative">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div 
                  style={{ width: `${currentCourse.progress}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                ></div>
              </div>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
              Next lesson: {currentCourse.nextLesson}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
          {stats.map((item, index) => (
            <div key={index} className="bg-white dark:bg-neutral-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  {item.icon}
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">
                      {item.label}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {item.value}
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enrolled Courses Button */}
        <div className="mb-6">
          <Link 
            to="/enrolled-courses" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            View Enrolled Courses
          </Link>
        </div>

        {/* Upcoming Lessons */}
        <div className="bg-white dark:bg-neutral-800 shadow overflow-hidden sm:rounded-md mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Upcoming Lessons
            </h3>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {upcomingLessons.map((lesson, index) => (
              <li key={index}>
                <Link to={`/lesson/${index}`} className="block hover:bg-gray-50 dark:hover:bg-neutral-700">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {lesson.name}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {lesson.time}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                          <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {lesson.time}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <ChevronRight className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Learning Progress */}
        <div className="bg-white dark:bg-neutral-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Learning Progress
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
              Your language learning journey at a glance.
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Total study time
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  50 hours
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Vocabulary learned
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  500 words
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Grammar concepts mastered
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  15
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default AccountDashboard;