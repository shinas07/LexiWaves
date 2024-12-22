import React, { useState } from 'react';
import Sidebar from './AdminSidebar';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen font-sans bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-neutral-900 shadow p-4 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl text-gray-700 dark:text-gray-300">
            {sidebarOpen ? '⮜' : '☰'}
          </button>
          {/* <div className="flex items-center space-x-4">
            <button className="text-xl text-gray-700 dark:text-gray-300">🔔</button>
            <button className="text-xl text-gray-700 dark:text-gray-300">👤</button>
          </div> */}
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-neutral-800">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}