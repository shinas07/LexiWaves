import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, LogOut, ChevronRight, Edit2, Check } from 'lucide-react';
import { DotBackground } from '../../components/Background';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { Link } from 'react-router-dom';

const UserAccountPage = () => {
  const navigate = useNavigate();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState('Shinas Aman');
  const [tempName, setTempName] = useState(name);
  const dispach = useDispatch()

  const handleLogout = () => {
    // Implement logout logic here
    dispach(logout())
    navigate('/');
  };

  const handleNameEdit = () => {
    if (isEditingName) {
      setName(tempName);
    } else {
      setTempName(name);
    }
    setIsEditingName(!isEditingName);
  };

  return (
    <DotBackground>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Your Account</h2>
          <p className="mt-2 text-sm text-gray-600">Manage your personal information</p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                {isEditingName ? (
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="border-b border-gray-300 focus:border-indigo-500 bg-transparent focus:outline-none text-lg font-medium text-gray-900"
                  />
                ) : (
                  <span className="text-lg font-medium text-gray-900">{name}</span>
                )}
              </div>
              <button
                onClick={handleNameEdit}
                className="p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                {isEditingName ? <Check className="h-5 w-5 text-green-500" /> : <Edit2 className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-lg text-gray-700">johndoe@example.com</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link to="/settings" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-lg font-medium text-gray-900">Settings</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>

            <Link to="/enrolled-courses" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-lg font-medium text-gray-900">Enrolled Courses</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          </div>

          {!isChangingPassword ? (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <Lock className="mr-2 h-5 w-5" />
              Change Password
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="password"
                placeholder="New Password"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              <button
                onClick={() => setIsChangingPassword(false)}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                Update Password
              </button>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
    </DotBackground>
  );
};

export default UserAccountPage;