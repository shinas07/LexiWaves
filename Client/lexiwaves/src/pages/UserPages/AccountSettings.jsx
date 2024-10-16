import React, { useState } from 'react';
import { AlertTriangle, Globe, Mail, HelpCircle } from 'lucide-react';
import UserDashboardLayout from './DashboardLayout';

const SettingsPage = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [language, setLanguage] = useState('English');

  const handleDeactivate = () => {
    // Perform deactivation logic here
    setShowConfirmation(false);
  };

  return (
    <UserDashboardLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-lg space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
            <p className="mt-2 text-sm text-gray-500">Manage your account and preferences</p>
          </div>

          <div className="space-y-6">
            {/* Language and Region Settings */}
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition">
              <div className="flex items-center space-x-3">
                <Globe className="h-6 w-6 text-indigo-500" />
                <div>
                  <span className="text-lg font-medium text-gray-900">Language</span>
                  <p className="text-sm text-gray-500">Current: {language}</p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option>English</option>
                <option>Arabic</option>
                <option>French</option>
              </select>
            </div>

            {/* Help and Support */}
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition">
              <div className="flex items-center space-x-3">
                <HelpCircle className="h-6 w-6 text-indigo-500" />
                <div>
                  <span className="text-lg font-medium text-gray-900">Help and Support</span>
                  <p className="text-sm text-gray-500">Access FAQs or contact support</p>
                </div>
              </div>
              <button className="text-indigo-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                Go
              </button>
            </div>

            {/* Feedback and Suggestions */}
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition">
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6 text-indigo-500" />
                <div>
                  <span className="text-lg font-medium text-gray-900">Feedback and Suggestions</span>
                  <p className="text-sm text-gray-500">Provide feedback or suggest features</p>
                </div>
              </div>
              <button className="text-indigo-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                Submit
              </button>
            </div>

            {/* Deactivate Account */}
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <div>
                  <span className="text-lg font-medium text-red-600">Deactivate Account</span>
                  <p className="text-sm text-gray-500">This action is permanent</p>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Confirm Deactivation</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to deactivate your account? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
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
