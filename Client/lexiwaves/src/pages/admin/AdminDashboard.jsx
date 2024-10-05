import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from './Layout';

// Reused data from your original component
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];

const userActivityData = [
  { name: 'Mon', active: 3000 },
  { name: 'Tue', active: 3500 },
  { name: 'Wed', active: 4000 },
  { name: 'Thu', active: 3700 },
  { name: 'Fri', active: 4200 },
  { name: 'Sat', active: 3800 },
  { name: 'Sun', active: 3500 },
];

const SimpleBarChart = ({ data }) => (
  <div className="flex justify-around items-end h-48">
    {data.map((item, index) => (
      <div key={index} className="flex flex-col items-center">
        <div className="bg-teal-500 w-10" style={{ height: `${item.sales / 100}px` }} />
        <span className="mt-2 text-sm text-gray-300">{item.name}</span>
      </div>
    ))}
  </div>
);

const SimpleLineChart = ({ data }) => (
  <div className="flex justify-around items-end h-48">
    {data.map((item, index) => (
      <div key={index} className="flex flex-col items-center">
        <div className="bg-green-500 w-1" style={{ height: `${item.active / 20}px` }} />
        <span className="mt-2 text-sm text-gray-300">{item.name}</span>
      </div>
    ))}
  </div>
);

const Logo = () => (
  <a href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
    <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium text-black dark:text-white whitespace-pre"
    >
      LexiWaves Admin
    </motion.span>
  </a>
);



export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();


  return (
    <Layout>
    <div className="flex h-screen font-sans bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100">
 

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-neutral-800">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {[
                { title: 'Total Revenue', value: '$45,256', change: '+20.1% from last month' },
                { title: 'New Students', value: '+2350', change: '+180.1% from last month' },
                { title: 'Active Tutors', value: '+573', change: '+201 since last hour' },
                { title: 'Course Completions', value: '1,234', change: '+12% this week' },
              ].map((item, index) => (
                <div key={index} className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{item.title}</h3>
                  <p className="text-2xl font-bold mb-1 text-teal-600 dark:text-teal-400">{item.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.change}</p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Monthly Course Sales</h3>
                <SimpleBarChart data={salesData} />
              </div>
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Student Activity</h3>
                <SimpleLineChart data={userActivityData} />
              </div>
            </div>
          </div>
        </main>
</div>
</Layout>
  );
}
