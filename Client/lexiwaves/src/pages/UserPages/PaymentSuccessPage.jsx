import React from 'react';
import { Link } from 'react-router-dom';
import { DotBackground } from '../../components/Background';
import { motion } from 'framer-motion';

const SuccessPage = () => {
    return (
        <DotBackground>
            <div className="flex flex-col items-center  min-h-screen text-green-200 p-6"> {/* Changed text color */}
                {/* Animated Success Message */}
                <motion.h1 
                    className="text-5xl font-extrabold mt-32 text-green-700"  // Updated to light green
                    initial={{ opacity: 0, y: -50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }}
                >
                    Payment Successful!
                </motion.h1>

                <motion.p 
                    className="text-lg mt-4 text-white"  // Updated to light green
                    initial={{ opacity: 0, y: -50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    You have successfully enrolled in your course.
                </motion.p>

                <motion.p 
                    className="text-sm mt-32 text-neutral-400"  // Updated to light green
                    initial={{ opacity: 0, y: -50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    Get ready to start your learning journey!
                </motion.p>

                {/* Button with Arrow */}
                <div className="flex mt-2 items-center">
                    <Link 
                        to="/enrolled-courses" // Adjust the path as needed
                        className="flex items-center bg-neutral-800 text-sm text-white py-2 px-4 rounded-lg shadow-lg hover:bg-neutral-600 transition duration-300"
                    >
                        {/* Left Arrow */}
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
                </div>
            </div>
        </DotBackground>
    );
};

export default SuccessPage;
