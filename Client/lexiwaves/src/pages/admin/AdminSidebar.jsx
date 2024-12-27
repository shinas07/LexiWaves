import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { XMarkIcon } from '@heroicons/react/24/outline';
import { X } from 'lucide-react'
import api from '../../service/api';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try{
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('lexi-admin/logout/',{
        refreshToken: refreshToken
      });
    
    dispatch(logout())
    setShowLogoutModal(false);
    toast.success('logout successful!')
    navigate('/')
    }catch(error){
      dispatch(logout())
      navigate('/')
    }
  };

  const links = [
    { name: 'Dashboard', link: '/admin-dashboard' },
    { name: 'Students', link: '/admin-students-list' },
    { name: 'Tutors', link: '/admin-tutor-list' },
    { name: 'Languages', link: '/admin-language' },
    { name: 'Courses', link: '/admin-Approved-courses-list' },
    { name: 'Enrolled Courses', link: '/admin-enrolled-courses' },
    { name: 'Reports', link:'/admin-report'},
    { name: 'Revenue', link: '/admin-revenue-details' },
    { name: 'Logout', action: () => setShowLogoutModal(true) }
  ];

  return (
    <>
      <aside className={`bg-white dark:bg-neutral-900 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} overflow-hidden border-r border-neutral-200 dark:border-neutral-700`}>
        <div className="p-5">
          <Link to="/admin-dashboard" className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20">
            <div className='w-12'>
            <img className='rounded-full' src="https://i.imghippo.com/files/qJMT7659cYw.jpg"></img>
            </div>
            {isOpen && <span className="font-medium whitespace-pre">LexiWaves Admin</span>}
          </Link>
          <nav className="mt-8">
            <ul>
              {links.map((item, index) => (
                <li key={index} className="mb-2">
                  {item.action ? (
                    <button
                      onClick={item.action}
                      className="w-full text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 flex items-center p-2 rounded-md"
                    >
                      <span className={`ml-2 ${isOpen ? 'block' : 'hidden'}`}>{item.name}</span>
                    </button>
                  ) : (
                    <Link 
                      to={item.link} 
                      className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 flex items-center p-2 rounded-md"
                    >
                      <span className={`ml-2 ${isOpen ? 'block' : 'hidden'}`}>{item.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Modal Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setShowLogoutModal(false)}
            />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
              {/* Close Button */}
              <button
                onClick={() => setShowLogoutModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Modal Header */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Confirm Logout
                </h3>
              </div>

              {/* Modal Body */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Are you sure you want to logout from the admin panel?
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}