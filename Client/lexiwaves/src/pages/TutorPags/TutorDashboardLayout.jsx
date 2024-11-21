import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sidebar, SidebarBody } from '../../components/ui/Account_sidebar.jsx';
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUser,
  IconHome,
  IconBook,
  IconMail,
  IconCalendar,
  IconLogout,
} from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice.jsx';
import { toast } from 'sonner';
import api from '../../service/api.jsx';
import { cn } from '../../lib/utils.jsx';


const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-center shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Confirm Logout</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const PeopleInteractionIcon = () => (
  <svg
    className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M9 11l3 3" />
    <path d="M12 14l-3 3" />
  </svg>
);


const TutorDashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);



  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const refresh_token = localStorage.getItem('refreshToken');
      await api.post('/tutor/logout/', { refresh_token }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      await dispatch(logout());
      toast.success('Logout Successful!');
      navigate('/tutor-signin');
    } catch (error) {
      await dispatch(logout());
      toast.success('Logged out Successfully!');
      navigate('/tutor-signin');
    }
  };

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);


  const links = [
    {
      label: 'Dashboard',
      to: '/tutor/dashboard',
      icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: 'My Courses',
      to: '/tutor-course-list',
      icon: <IconBook className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: 'Student Interactions',
      to: '/tutor/interaction/student-list',
      icon: <PeopleInteractionIcon/>
    },
    // {
    //   label: 'Calendar',
    //   to: '/tutor/calendar',
    //   icon: <IconCalendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    // },
    {
      label: 'Profile',
      to: '/tutor/profile',
      icon: <IconUser className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: 'Settings',
      to: '/tutor/settings',
      icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  const SidebarLink = ({ link }) => {
    return (
      <Link to={link.to} className="flex items-center p-2 hover:bg-indigo-500 hover:text-white transition-all duration-300">
        {link.icon}
        <span className="ml-3">{link.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-800 flex">
      <div className={cn("flex flex-col md:flex-row w-full border-x border-neutral-200 dark:border-neutral-700 overflow-hidden")}>
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {/* Sidebar Links */}
              <div className="mt-8 flex flex-col text-white gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
              <div className="flex items-center mt-4 cursor-pointer" onClick={openLogoutModal}>
                <IconLogout className="text-neutral-700 ml-2 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                <span className="ml-2 text-white">Logout</span>
              </div>
            </div>
          </SidebarBody>
        </Sidebar>

        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-neutral-900">
          {/* Main Content Header with Project Name */}
          <div className="bg-indigo-600 text-white p-6 flex items-center justify-between">
            <h1 className="text-3xl font-semibold">lexiWaves</h1>
            <div className="flex items-center">
              <IconUser className="h-6 w-6 mr-2" />
              <span className="text-lg">Welcome, Tutor</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 bg-white dark:bg-neutral-900 rounded-lg mt-4">
            {children}
          </div>
        </div>
      </div>

      <LogoutModal
      isOpen={isLogoutModalOpen}
      onClose={closeLogoutModal}
      onConfirm={() => {
        closeLogoutModal();
        handleLogout();
      }}
    />

    </div>
  );
};

export default TutorDashboardLayout;
