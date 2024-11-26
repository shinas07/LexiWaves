import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { DotBackground } from '../../components/Background';

const StudentUnauthorized = () => {
  const navigate = useNavigate();

  return (
    <DotBackground>
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700/50">
        <div className="text-center">
          {/* Icon */}
          <div className="inline-block p-4 bg-red-500/10 rounded-full mb-4">
            <ShieldAlert className="w-12 h-12 text-red-500" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2">
            Access Denied
          </h1>

          {/* Description */}
          <p className="text-gray-400 mb-8">
            Sorry, this page is only accessible to students. Please log in with a student account to access this content.
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-gray-700/50 my-6"></div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 
                       bg-gray-700 hover:bg-gray-600 text-white rounded-xl
                       transition-all duration-200 ease-in-out
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3
                       bg-blue-600 hover:bg-blue-700 text-white rounded-xl
                       transition-all duration-200 ease-in-out
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <Home className="w-4 h-4" />
              Return Home
            </button>
          </div>

          {/* Help Text */}
          <p className="mt-8 text-sm text-gray-500">
            If you believe this is a mistake, please{' '}
            <a 
              href="mailto:lexisupport@example.com" 
              className="text-blue-400 hover:text-blue-300 underline"
            >
              contact support
            </a>
          </p>
        </div>

        {/* Optional: Animation Effect */}
        <div className="absolute inset-0 -z-10 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-500/10 rounded-2xl"></div>
        </div>
      </div>
    </div>
    </DotBackground>
  );
};

export default StudentUnauthorized;