import React, { useState } from 'react';
import { AlertTriangle, Globe, Mail, HelpCircle, Bell, Shield } from 'lucide-react';
import UserDashboardLayout from './DashboardLayout';
import { toast } from 'sonner';
import api from '../../service/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

const SettingsPage = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [language, setLanguage] = useState('English');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Keep your original handleDeactivate function
  const handleDeactivate = async () => {
    if(!email || !password){
      toast.error('Please fill in both fields.');
      return;
    }

    const token = localStorage.getItem('accessToken');
    try {
      const response = await api.post('/user/deactivate-account/',
        { email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      if (response.data.success){
        toast.success('Your account has been successfully deactivated.');
        dispatch(logout());
        navigate('/');
      } else {
        setEmail('');
        setPassword('');
        toast.error(response.data.message || 'Failed to deactivate account.');
      }
    } catch(error) {
      toast.error('An error occurred while deactivating your account.');
      setEmail('');
      setPassword('');
     
    }
    setShowConfirmation(false);
  };

  return (
    <UserDashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account preferences and settings</p>
        </div>

        {/* Settings Cards */}
        <div className="space-y-4">
          {/* Language Settings */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-800/70 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Globe className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Language</h3>
                  <p className="text-sm text-gray-400">Current: {language}</p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-700/50 text-gray-200 rounded-lg px-3 py-1.5 text-sm border border-gray-600 focus:ring-2 focus:ring-blue-500"
              >
                <option>English</option>
                <option>Arabic</option>
                <option>French</option>
              </select>
            </div>
          </div>

          {/* Help and Support */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-800/70 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <HelpCircle className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Help and Support</h3>
                  <p className="text-sm text-gray-400">Access FAQs or contact support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-800/70 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Mail className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Feedback and Suggestions</h3>
                  <p className="text-sm text-gray-400">Provide feedback or suggest features</p>
                </div>
              </div>
            </div>
          </div>

          {/* Deactivate Account */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-800/70 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-red-400 font-medium">Deactivate Account</h3>
                  <p className="text-sm text-gray-400">This action is permanent</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmation(true)}
                className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>

        {/* Deactivation Modal - Keeping original functionality */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Confirm Deactivation</h3>
              </div>
              
              <p className="text-gray-400 text-sm mb-6">
                Are you sure you want to deactivate your account? This action cannot be undone.
                All your data will be permanently deleted.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setEmail('');
                    setPassword('');
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivate}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserDashboardLayout>
  );
};

export default SettingsPage;