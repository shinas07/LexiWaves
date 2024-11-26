import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { DotBackground } from '../../components/Background';

const PaymentCancel = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear browser history and replace with current page
        window.history.pushState(null, '', window.location.href);
        window.onpopstate = () => {
            navigate('/courses');
        };

        return () => {
            window.onpopstate = null;
        };
    }, [navigate]);

    return (
        <DotBackground>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <div className="text-center">
                    <XCircle className="mx-auto h-16 w-16 text-red-500" />
                    
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Payment Cancelled
                    </h2>
                    
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                        Your payment was cancelled. Don't worry - no charges were made.
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                        <ul className="text-sm text-red-700 dark:text-red-300 space-y-2">
                            <li>• No payment has been processed</li>
                            <li>• Your course enrollment was not completed</li>
                            <li>• You can try enrolling again anytime</li>
                        </ul>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={() => navigate('/courses')}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                        >
                            Browse More Courses
                        </button>
                        
                        <button
                            onClick={() => navigate('/')}
                            className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Need help? {' '}
                        <a 
                            href="/contact" 
                            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
        </DotBackground>
    );
};

export default PaymentCancel;