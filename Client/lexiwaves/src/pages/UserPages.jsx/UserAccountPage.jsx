import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import api from "../../service/api";

const UserAccountPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/'); 
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    try {
      await axios.post('/api/change-password', { currentPassword, newPassword }, { withCredentials: true });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error('Password change failed:', error);
      toast.error("Password change failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Account Details</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Profile Information</h3>
          <div className="flex items-center space-x-4 mb-4">
            <img
              className="h-16 w-16 rounded-full"
            //   src={user.avatar || 'https://via.placeholder.com/64'}
            //   alt={`${user.firstName} ${user.lastName}`}
            />
            <div>
              {/* <p className="text-xl font-semibold">{`${user.firstName} ${user.lastName}`}</p> */}
              {/* <p className="text-gray-600">{user.email}</p> */}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Change Password</h3>
          <div className="mb-4">
            <label htmlFor="current-password" className="block text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Current Password"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="new-password" className="block text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="New Password"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirm-password" className="block text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm New Password"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Change Password
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserAccountPage;
