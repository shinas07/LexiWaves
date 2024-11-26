import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center space-y-6 max-w-lg">
        {/* Error Display */}
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-gray-800">404</h1>
          <h2 className="text-2xl font-medium text-gray-700">Page Not Found</h2>
        </div>

        {/* Message */}
        <p className="text-gray-600">
          The page you are looking for doesn't exist.
        </p>

        {/* Navigation Button */}
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-2.5 text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 border border-gray-300 transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;