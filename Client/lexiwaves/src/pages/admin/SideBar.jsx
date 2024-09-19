import React from "react";
import { useState } from "react";

export default function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
  
    return (
        <div className="flex h-screen font-sans bg-gray-900 text-gray-100">
        <aside className={`bg-gray-800 text-white transition-width duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} overflow-hidden`}>
        <div className="p-5">
          <h2 className={`text-xl font-bold mb-6 ${sidebarOpen ? 'block' : 'hidden'}`}>LexiWaves</h2>
          <nav className='mt-12'>
            <ul>
              {['Dashboard', 'Courses', 'Students', 'Tutors', 'Analytics', 'Messages'].map((item, index) => (
                <li key={index} className="mb-6">
                  <a href="#" className="text-gray-300 hover:text-gray-400 flex items-center">
                    <span className={`ml-2 ${sidebarOpen ? 'block' : 'hidden'}`}>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 shadow p-4 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl text-gray-200">
            {sidebarOpen ? '⮜' : '☰'}
          </button>
          <input
            type="search"
            placeholder="Search courses, tutors..."
            className="px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-md focus:outline-none focus:border-teal-500"
          />
          <div className="flex items-center space-x-4">
            <button className="text-xl text-gray-300">🔔</button>
            <button className="text-xl text-gray-300">👤</button>
          </div>
        </header>
        </div>
        </div>
)}