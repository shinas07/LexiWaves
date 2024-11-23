import React from 'react';
import { ArrowLeft, ShieldAlert, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DotBackground } from '../../components/Background';

const AdminUnauthorized = () => {
    const navigate = useNavigate();

    return (
        <DotBackground>
            <div className="min-h-screen  flex items-center justify-center p-4">
                <div className="max-w-md w-full backdrop-blur-sm bg-white/10 rounded-2xl shadow-2xl p-8 text-center border border-white/10">
                    {/* Admin Lock Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="p-4 bg-red-500/10 rounded-full animate-pulse">
                                <Lock className="w-16 h-16 text-red-500" />
                            </div>
                            <ShieldAlert className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2" />
                        </div>
                    </div>

                    {/* Error Content */}
                    <div className="space-y-4 mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            Admin Access Only
                        </h1>
                        <div className="space-y-3">
                            <p className="text-gray-300 text-lg">
                                This area is restricted to LexiWaves administrators only.
                            </p>
                            <p className="text-sm text-gray-400">
                                Please log in with your administrator credentials to access this section.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full group flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl transition-all duration-300 border border-white/10 hover:border-white/30"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Return to Homepage
                        </button>
                        
                        <button
                            onClick={() => navigate('/admin-login')}
                            className="w-full group flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl transition-all duration-300"
                        >
                            <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Admin Login
                        </button>
                    </div>

                    {/* Support Information */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <div className="flex flex-col items-center space-y-3">
                            <p className="text-sm text-gray-400">
                                For administrative access requests, please contact
                            </p>
                            <a 
                                href="mailto:admin@lexiwaves.com" 
                                className="group flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
                            >
                                <Mail className="w-4 h-4 group-hover:animate-bounce" />
                                admin@lexiwaves.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </DotBackground>
    );
};

export default AdminUnauthorized;