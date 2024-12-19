import React, { useEffect, useState } from "react";
import { DotBackground } from "../../components/Background";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../service/api";
import { Link } from "react-router-dom";

const WaitingForApproval = () => {
    const [approvalStatus, setApprovalStatus] = useState({
    
        status: 'pending',
        profileCompletion: 0,
        missingFields: [],
        submissionDate: null
    });
    const navigate = useNavigate();

    useEffect(() => {
        checkApprovalStatus();
        
        // Poll for status updates every 5 minutes
        const intervalId = setInterval(checkApprovalStatus, 300000);
        return () => clearInterval(intervalId);
    }, []);

    const checkApprovalStatus = async () => {
        try {
            const response = await api.get('/tutor/approval-status/');
            setApprovalStatus({
                status: response.data.status,
                profileCompletion: response.data.profile_completion,
                submissionDate: new Date(response.data.submission_date)
            });
            localStorage.setItem('adminApproved',response.data.status)

            // Redirect if approved
            if (response.data.is_approved) {
                toast.success("Your account has been approved!");
                navigate('/tutor/dashboard');
            }

        } catch (error) {
            return;
            
        }
    };

    
    return (
        <div className="relative min-h-screen flex flex-col  items-center justify-center bg-black overflow-hidden">
        <DotBackground>
            
            {/* Main Content Container */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-4xl mx-auto px-4 mt-36"
            >
                {/* Status Indicator */}
                <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 mx-auto mb-8"
                >
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
                        <div className="relative rounded-full bg-blue-500 p-6">
                            <svg 
                                className="w-12 h-12 text-white" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20"
                >
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Under Review
                    </h2>
                    
                    {/* Status Timeline */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="h-1 w-16 bg-blue-500"></div>
                            <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                            <div className="h-1 w-16 bg-gray-700"></div>
                            <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                        </div>
                    </div>

                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Your profile is currently under review by our admin team. 
                        We'll notify you once the verification is complete.
                    </p>

                    {/* Action Cards */}
                    <div className="grid md:grid-cols-2 gap-4 mt-8">
                    <motion.div>  
                    <Link 
                        to="/tutor-details"  
                        className="group p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 block"
                    >
                        <h3 className="text-white text-lg font-semibold mb-2">
                            Complete Profile
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Ensure all your details are up to date
                        </p>
                    </Link>
                </motion.div>
                <motion.div  
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link 
                            to="/tutor-support"  
                            className="group p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 block"
                        >
                            <h3 className="text-white text-lg font-semibold mb-2">
                                Need Help?
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Contact our support team
                            </p>
                        </Link>
                    </motion.div>
                    </div>
                </motion.div>

                {/* Estimated Time */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 text-center text-gray-400"
                >
                    <p>Estimated review time: 24-48 hours</p>
                </motion.div>
            </motion.div>

          
            </DotBackground>
        </div>
     
    );
};

export default WaitingForApproval;