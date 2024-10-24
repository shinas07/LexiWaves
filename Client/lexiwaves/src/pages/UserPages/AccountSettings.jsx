import React, { useState } from 'react';
import { AlertTriangle, Globe, Mail, HelpCircle } from 'lucide-react';
import UserDashboardLayout from './DashboardLayout';
import { toast } from 'sonner';
import api from '../../service/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

const SettingsPage = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [language, setLanguage] = useState('English');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch()
  const navigate = useNavigate()




  const handleDeactivate = async () => {
    if(!email || !password){
      toast.error('Pleace fill in both fields.');
      return
    }

    const token = localStorage.getItem('accessToken')
    try {
      const response = await api.post('/user/deactivate-account/',{ email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      if (response.data.success){
        toast.success('Your account has been successfully deactivated.');
        dispatch(logout())
        navigate('/')
      }else{
        setEmail('')
        setPassword('')
        toast.error(response.data.message ||'Falid to deactivate account.')
      }
    }catch(error){
      toast.error('An error occurred while deactivating your account.');
      setEmail('')
      setPassword('')
      console.log(error)
    }

    setShowConfirmation(false);
  
  };

  return (
    <UserDashboardLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full dark:bg-neutral-800 p-8 rounded-2xl shadow-lg space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Settings</h2>
            <p className="mt-2 text-sm text-gray-200">Manage your account and preferences</p>
          </div>

          <div className="space-y-6">
            {/* Language and Region Settings */}
            <div className="flex items-center justify-between p-4 hover:bg-neutral-700 rounded-lg transition">
              <div className="flex items-center space-x-3">
                <Globe className="h-6 w-6 text-indigo-500" />
                <div>
                  <span className="text-lg font-medium text-white">Language</span>
                  <p className="text-sm text-gray-100">Current: {language}</p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 p-2 transition duration-150 ease-in-out"
              >
                <option className="bg-white dark:bg-gray-800">English</option>
                <option className="bg-white dark:bg-gray-800">Arabic</option>
                <option className="bg-white dark:bg-gray-800">French</option>
              </select>
            </div>

            {/* Help and Support */}
            <div className="flex items-center justify-between p-4 hover:bg-neutral-700 rounded-lg transition">
              <div className="flex items-center space-x-3">
                <HelpCircle className="h-6 w-6 text-indigo-500" />
                <div>
                  <span className="text-lg font-medium text-white">Help and Support</span>
                  <p className="text-sm text-gray-100">Access FAQs or contact support</p>
                </div>
              </div>
              {/* <button className="text-indigo-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                Go
              </button> */}
            </div>

            {/* Feedback and Suggestions */}
            <div className="flex items-center justify-between p-4 hover:bg-neutral-700 rounded-lg transition">
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6 text-indigo-500" />
                <div>
                  <span className="text-lg font-medium text-white">Feedback and Suggestions</span>
                  <p className="text-sm text-gray-100">Provide feedback or suggest features</p>
                </div>
              </div>
              {/* <button className="text-indigo-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                Submit
              </button> */}
            </div>

            {/* Deactivate Account */}
            <div className="flex items-center justify-between p-4 hover:bg-neutral-700 rounded-lg transition">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <div>
                  <span className="text-lg font-medium text-red-600">Deactivate Account</span>
                  <p className="text-sm text-gray-100">This action is permanent</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmation(true)}
                className="bg-red-100 text-red-600 hover:bg-red-200 rounded-md px-4 py-2 transition"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>

        {/* Deactivation Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex ml-12 items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Confirm Deactivation</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Are you sure you want to deactivate your account? This action cannot be undone.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                All your data will be permanently deleted.
              </p>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  required
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" // Regex pattern for email validation
                  title="Please enter a valid email address." // Custom error message
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value = {password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() =>  {
                    setShowConfirmation(false); setEmail(''); setPassword('');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivate}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
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
