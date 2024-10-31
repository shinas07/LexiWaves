import React, { useState, useEffect } from 'react';
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

const TutorDashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const refresh_token = localStorage.getItem('refreshToken');
      await api.post('/tutor/logout/', { refresh_token }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      dispatch(logout());
      toast.success('Logout Successful!');
      navigate('/');
    } catch (error) {
      console.error('Logout error from server:', error);
      dispatch(logout());
      toast.success('Logged out Successfully!');
      navigate('/');
    }
  };

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
      label: 'Messages',
      to: '/tutor/messages',
      icon: <IconMail className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: 'Calendar',
      to: '/tutor/calendar',
      icon: <IconCalendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
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
      <Link to={link.to} className="flex items-center p-2">
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
              <div className="mt-8 flex flex-col text-white gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
              <div className="flex items-center mt-4 cursor-pointer" onClick={handleLogout}>
                <IconLogout className="text-neutral-700 ml-2 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                <span className="ml-2 text-white">Logout</span>
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-neutral-900">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboardLayout;
