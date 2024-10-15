import React from 'react';
import { DotBackground } from '../../components/Background';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <DotBackground>
        <div className="bg-neutral-100 rounded-lg shadow-lg p-6 mt-16 max-w-2xl mx-auto">

      

          <h1 className="text-2xl font-bold text-gray-800 mb-4">Terms of Service</h1>
          <p className="text-gray-700 text-sm  mb-4">
            Welcome to Lexiwaves! By using our services, you agree to the following terms and conditions.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h2>
          <p className="text-gray-700 text-sm  mb-4">
            By accessing or using our platform, you agree to comply with these Terms of Service and all applicable laws and regulations.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">2. User Responsibilities</h2>
          <p className="text-gray-700 text-sm  mb-4">
            Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Content Policy</h2>
          <p className="text-gray-700 text-sm  mb-4">
            Users must not post or share content that is offensive, harmful, or violates any laws. We reserve the right to remove such content and terminate accounts as necessary.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Limitation of Liability</h2>
          <p className="text-gray-700 text-sm mb-4">
            Lexiwaves shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Changes to Terms</h2>
          <p className="text-gray-700 text-sm  mb-4">
            We reserve the right to modify these Terms of Service at any time. Users will be notified of any significant changes.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Contact Us</h2>
          <p className="text-gray-700 text-sm  mb-4">
            If you have any questions or concerns about these Terms, please contact us at support@lexiwaves.com
          </p>

          <p className="text-gray-600 text-sm">
            Last updated: [30-11-2024]
          </p>


          <div className="mb-4">
            <Link to="/tutor-details" className="text-gray-900 text-sm underline">
              Go to Details Page
            </Link>
          </div>
        </div>
      </DotBackground>
    </div>
  );
};

export default TermsOfService;
