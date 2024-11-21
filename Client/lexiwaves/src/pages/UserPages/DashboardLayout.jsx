import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {  Sidebar, SidebarBody } from "../../components/ui/Account_sidebar.jsx";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconHome,
} from "@tabler/icons-react";
import { cn } from "../../lib/utils.jsx";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice.jsx";
import { toast } from "sonner";
import api from "../../service/api.jsx";
import { CodeSquare } from "lucide-react";
import { motion, AnimatePresence} from 'framer-motion'

const UserDashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticatedUser = useSelector(state => state.auth.isAuthenticated)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const refresh_token = localStorage.getItem('refreshToken');

      await api.post('/user/logout/', { refresh_token }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      await dispatch(logout());
      toast.success('Logout Successful!');
      navigate("/"); // Navigate to the root path after successful logout
      
    } catch (error) {
      toast.error('Logout error from server:');
    
      await dispatch(logout());
      toast.error('Failed to logout, please try again.'); // Show error message
      navigate("/"); // Navigate to root path even on error
    }
  };
  
  const links = [
    {
      label: "Home",
      to: "/",
      icon: <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Dashboard",
      to: "/user-account",
      icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Profile",
      to: "/profile",
      icon: <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      to: "/settings",
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
  const [open, setOpen] = useState(false);

  const handleShowModal = () => {
    setIsModalOpen(true);
    }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleConfirmLogout = () => {
    handleLogout();
    setIsModalOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-800 flex">
      <div className={cn(
        "flex flex-col md:flex-row w-full border-x border-neutral-200 dark:border-neutral-700 overflow-hidden",
      )}>
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <div className="mt-8 flex flex-col text-white gap-2">
                {links.map((link, idx) => (
                  <SidebarLink 
                    key={idx} 
                    link={link} 
                  />
                ))}
              </div>
              <div className="flex items-center mt-4 cursor-pointer" onClick={handleShowModal}>
                <IconArrowLeft className="text-neutral-700 ml-2 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                <span className="ml-2 text-white">Logout</span>
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
 {/* Modal Component */}
 <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-neutral-900 border border-white/[0.05] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
              >
                <div className="mb-6">
                  <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                    <IconArrowLeft className="h-6 w-6 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Confirm Logout
                  </h2>
                  <p className="text-neutral-400">
                    Are you sure you want to log out of your account?
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-white/[0.05] text-white hover:bg-white/5 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
              </motion.div>
          )}
        </AnimatePresence>


        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-neutral-900">
          {children}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardLayout;