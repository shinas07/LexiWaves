import React from 'react';
import { DotBackground } from '../../components/Background';
import { Bell, Mail, User } from 'lucide-react'; // Icons for settings

const SettingsPage = () => {
  return (
    <DotBackground>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Settings</h2>
            <p className="mt-2 text-sm text-gray-600">Customize your preferences</p>
          </div>
          
          <div className="mt-8 space-y-6">
            {/* Notification Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-indigo-500 mr-2" />
                <span className="text-lg font-medium text-gray-900">Notifications</span>
              </div>
              <button className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="text-sm text-indigo-500">Edit</span>
              </button>
            </div>

            {/* Email Preferences */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-indigo-500 mr-2" />
                <span className="text-lg font-medium text-gray-900">Email Preferences</span>
              </div>
              <button className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="text-sm text-indigo-500">Edit</span>
              </button>
            </div>

            {/* Account Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="h-5 w-5 text-indigo-500 mr-2" />
                <span className="text-lg font-medium text-gray-900">Account Settings</span>
              </div>
              <button className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="text-sm text-indigo-500">Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DotBackground>
  );
};

export default SettingsPage;
