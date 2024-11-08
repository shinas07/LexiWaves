import React from 'react';
import { Link } from 'react-router-dom';
import { DotBackground } from '../../components/Background';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa'; // Import a success icon

const SuccessPage = ({ userName, courseName }) => {
    return (
        <DotBackground>
            <div className="flex flex-col items-center min-h-screen mt-32 p-6"> {/* Gradient background */}
                <motion.div
                    className="mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaCheckCircle className="w-16 h-16 text-green-700" /> {/* Success icon */}
                </motion.div>

                <motion.h1 
                    className="text-5xl font-extrabold mt-8 text-green-700"
                    initial={{ opacity: 0, y: -50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }}
                >
                    Congratulations, {userName}!
                </motion.h1>

                <motion.p 
                    className="text-lg mt-4 text-neutral-400"
                    initial={{ opacity: 0, y: -50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    You have successfully enrolled in {courseName}.
                </motion.p>

                <motion.p 
                    className="text-sm mt-32 text-neutral-400"
                    initial={{ opacity: 0, y: -50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    Get ready to start your learning journey!
                </motion.p>

                {/* Button with Arrow */}
                <div className="flex mt-6 space-x-4">
                    {/* Button to view enrolled courses */}
                    <Link 
                        to="/enrolled-courses" // Adjust the path as needed
                        className="flex items-center bg-neutral-800 text-sm text-white py-2 px-4 rounded-lg shadow-lg hover:bg-neutral-600 transition duration-300"
                    >
                        <motion.div 
                            className="mr-2" 
                            animate={{ y: [0, -10, 0] }} 
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 3a1 1 0 011 1v10a1 1 0 11-2 0V4a1 1 0 011-1z" />
                                <path d="M15.293 9.293a1 1 0 00-1.414 0L10 12.586 6.121 8.707a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 000-1.414z" />
                            </svg>
                        </motion.div>
                        Go to Your Course
                    </Link>

                    {/* Button to continue browsing */}
                    <Link 
                        to="/courses" // Adjust the path as needed
                        className="flex items-center bg-green-500 text-sm text-white py-2 px-4 rounded-lg shadow-lg hover:bg-green-400 transition duration-300"
                    >
                        Continue Browsing
                    </Link>
                </div>

                {/* Optional: Social Sharing Section */}
                <motion.div 
                    className="mt-8 text-neutral-400"
                    initial={{ opacity: 0, y: 50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                </motion.div>
            </div>
        </DotBackground>
    );
};

export default SuccessPage;