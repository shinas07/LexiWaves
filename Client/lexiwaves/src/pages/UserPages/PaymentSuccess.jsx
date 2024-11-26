import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DotBackground } from '../../components/Background';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Star } from 'lucide-react';

const SuccessPage = ({ userName }) => {
    useEffect(() => {
        // Trigger multiple confetti bursts
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        const runConfetti = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#6366f1', '#8b5cf6', '#d946ef']
            });
            
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6366f1', '#8b5cf6', '#d946ef']
            });

            if (Date.now() < end) {
                requestAnimationFrame(runConfetti);
            }
        };
        
        runConfetti();
    }, []);

    return (
        <DotBackground>
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-lg w-full px-6">
                    {/* Main Success Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                    >
                        {/* Decorative Elements */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                            <motion.div 
                                className="flex gap-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ 
                                            y: [0, -10, 0],
                                            rotate: [0, 10, -10, 0]
                                        }}
                                        transition={{ 
                                            duration: 2,
                                            delay: i * 0.2,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                    >
                                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Success Message Card */}
                        <motion.div 
                            className="from-white/[0.05] to-transparent rounded-3xl p-8 backdrop-blur-sm"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.8 }}
                        >
                            {/* Success Icon */}
                            <motion.div 
                                className="w-20 h-20 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.3 }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <motion.path
                                            d="M5 13l4 4L19 7"
                                            strokeWidth={3}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.5, delay: 0.6 }}
                                        />
                                    </svg>
                                </motion.div>
                            </motion.div>

                            {/* Success Text */}
                            <motion.div 
                                className="text-center mt-8 space-y-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <h1 className="text-3xl font-bold text-white">
                                    Payment Successful!
                                </h1>
                                <p className="text-gray-400">
                                    Welcome aboard, {userName}! Your journey begins now.
                                </p>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div 
                                className="mt-8 space-y-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                            >
                                <Link 
                                    to="/enrolled-courses"
                                    className="block w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl text-center font-medium transition duration-300"
                                >
                                    Go to Your Course
                                </Link>
                                <Link 
                                    to="/courses"
                                    className="block w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl text-center font-medium transition duration-300"
                                >
                                    Continue Browsing
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </DotBackground>
    );
};

export default SuccessPage;