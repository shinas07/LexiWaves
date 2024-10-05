import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ isOpen, toggleSidebar }) {

    
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/admin-login');
  };

  const links = [
    { name: 'Dashboard', link: '/admin-dashboard' },
    { name: 'Courses', link: '/courses' },
    { name: 'Enrolled Courses', link: '/admin/enrolled-courses' },
    { name: 'Students', link: '/admin-students-list' },
    { name: 'Tutors', link: '/admin-tutor-list' },
    { name: 'Languages', link: '/admin-language' },
    { name: 'Logout', link: '/admin-login', action: handleLogout }
  ];

  return (
    <aside className={`bg-white dark:bg-neutral-900 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} overflow-hidden border-r border-neutral-200 dark:border-neutral-700`}>
      <div className="p-5">
        <Link to="/admin-dashboard" className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20">
          <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
          {isOpen && <span className="font-medium whitespace-pre">LexiWaves Admin</span>}
        </Link>
        <nav className="mt-8">
          <ul>
            {links.map((item, index) => (
              <li key={index} className="mb-2">
                <Link to={item.link} className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 flex items-center p-2 rounded-md">
                  <span className={`ml-2 ${isOpen ? 'block' : 'hidden'}`}>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}