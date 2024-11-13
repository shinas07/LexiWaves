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
 {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-black p-6 rounded-lg text-white max-w-sm w-full">
              <h2 className="text-xl mb-4">Are you sure you want to log out?</h2>
              <div className="flex justify-between">
                <button 
                  onClick={handleCloseModal} 
                  className="bg-gray-600 px-4 py-2 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => { handleLogout(); handleCloseModal(); }} 
                  className="bg-red-600 px-4 py-2 rounded-md text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-neutral-900">
          {children}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardLayout;