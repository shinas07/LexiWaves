import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, LogOut, ChevronRight, Edit2, Check, Settings, BookOpen } from 'lucide-react';
import { DotBackground } from '../../components/Background';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import api from '../../service/api';

const UserAccountPage = () => {
  const navigate = useNavigate();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  // const [tempName, setTempName] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get('/user/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
 // Set initial tempName to user's name
      } catch (error) {

        // Handle error (e.g., redirect to login if unauthorized)
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleNameEdit = async () => {
    if (isEditingName) {
      try {
        const token = localStorage.getItem('accessToken');
        await api.put('/user/profile/', { name: tempName }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData((prev) => ({ ...prev, name: tempName })); // Update userData with new name
      } catch (error) {
        console.error('Failed to update name:', error);
      }
    }
    setIsEditingName(!isEditingName);
  };

  const handlePasswordUpdate = async (newPassword, confirmPassword) => {
    // Add logic to handle password update (with appropriate validation)
    // This can be implemented when you're ready to add that functionality
  };
  return (
    <DotBackground>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
          <div className="text-center">
            <h2 className="mt-6 text-4xl font-extrabold text-gray-900">Your Account</h2>
            <p className="mt-2 text-sm text-gray-600">Manage your personal information and settings</p>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-6 w-6 text-indigo-500 mr-3" />
                    {isEditingName ? (
                      <input
                        type="text"
                        value={tempName} // Use tempName here
                        onChange={(e) => setTempName(e.target.value)}
                        className="border-b-2 border-indigo-300 focus:border-indigo-500 bg-transparent focus:outline-none text-xl font-medium text-gray-900"
                      />
                    ) : (
                      <span className="text-xl font-medium text-gray-900">{userData.first_name} {userData.last_name}</span> // Use userData.name
                    )}
                  </div>
                  <button
                    onClick={handleNameEdit}
                    className="p-2 rounded-full hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    {isEditingName ? <Check className="h-5 w-5 text-green-500" /> : <Edit2 className="h-5 w-5 text-indigo-400" />}
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-indigo-500 mr-3" />
                  <span className="text-xl text-gray-700">{userData.email}</span> {/* Use userData.email */}
                </div>
              </div>

              {!isChangingPassword ? (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <Lock className="mr-2 h-6 w-6" />
                  Change Password
                </button>
              ) : (
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="New Password"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-lg"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-lg"
                  />
                  <button
                    onClick={() => setIsChangingPassword(false)}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    Update Password
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Link to="/settings" className="flex items-center justify-between p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center">
                  <Settings className="h-6 w-6 text-indigo-500 mr-3" />
                  <span className="text-xl font-medium text-gray-900">Settings</span>
                </div>
                <ChevronRight className="h-6 w-6 text-indigo-400" />
              </Link>

              <Link to="/enrolled-courses" className="flex items-center justify-between p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center">
                  <BookOpen className="h-6 w-6 text-indigo-500 mr-3" />
                  <span className="text-xl font-medium text-gray-900">Enrolled Courses</span>
                </div>
                <ChevronRight className="h-6 w-6 text-indigo-400" />
              </Link>

              <button
                onClick={handleLogout}
                className="group relative w-full flex justify-center py-3 px-4 border-2 border-red-300 text-lg font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <LogOut className="mr-2 h-6 w-6" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </DotBackground>
  );
};

export default UserAccountPage;
