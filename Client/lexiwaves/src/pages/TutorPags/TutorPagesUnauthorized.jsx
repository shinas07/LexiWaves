import React from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DotBackground } from '../../components/Background';

const TutorUnauthorized = () => {
    const navigate = useNavigate();

    return (
        <DotBackground>
            <div className="min-h-screen bg-gradient-to-b flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    {/* Alert Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <UserPlus className="w-12 h-12 text-yellow-500" />
                        </div>
                    </div>

                    {/* Error Title */}
                    <h1 className="text-2xl font-bold text-gray-800 mb-3">
                        Restricted Access
                    </h1>

                    {/* Error Message */}
                    <div className="space-y-3 mb-8">
                        <p className="text-gray-600">
                            This area is only accessible to tutors.
                        </p>
                        <p className="text-sm text-gray-500">
                            To access this section, please sign up as a tutor. Contact support if you believe this is an problem.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Return to Homepage
                        </button>

                        <button
                            onClick={() => navigate('/tutor-signup')}
                            className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 py-2 px-4 rounded-md transition-colors duration-200"
                        >
                            Sign Up as Tutor
                        </button>
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Need assistance? Contact support at{' '}
                            <a 
                                href="mailto:support@lexiwaves.com" 
                                className="text-blue-600 hover:text-blue-800"
                            >
                                support@lexiwaves.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </DotBackground>
    );
};

export default TutorUnauthorized;
