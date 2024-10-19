import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGlobe, FaUser, FaSearch, FaArrowRight } from 'react-icons/fa';
import api from '../../service/api';
import { DotBackground } from '../../components/Background';
import FloatingNavbar from '../../components/Navbar';
import { toast } from 'sonner';

const LoadingAnimation = () => (
    <motion.div
        className="flex justify-center items-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <motion.div
            className="w-16 h-16 border-t-4 border-indigo-600 border-solid rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
    </motion.div>
);

const CommunitySelection = () => {
    const [username, setUsername] = useState('');
    const [languages, setLanguages] = useState([]);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [filteredLanguages, setFilteredLanguages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/chat/user-details');
                setUsername(response.data.username);
                setEmail(response.data.email);
            } catch (error) {
                toast.error('Failed to load UserName');
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                setLoading(true);
                const response = await api.get('/chat/coummunity-chat-rooms/');
                setLanguages(response.data);
                setFilteredLanguages(response.data);
            } catch (error) {
                toast.error('Error fetching languages:');
            } finally {
                setLoading(false);
            }
        };
        fetchLanguages();
    }, []);

    useEffect(() => {
        const results = languages.filter(lang =>
            lang.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredLanguages(results);
    }, [searchTerm, languages]);

    const joinCommunity = (language) => {
        if (username) {
            navigate(`/chat/${language}`, { state: { username, language, email } });
        } else {
            toast.info('User data is not Found');
        }
    };

    return (
        <DotBackground>
            <FloatingNavbar />
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-5xl w-full"
                >
                    <h1 className="text-4xl font-extrabold text-center mb-8 text-indigo-600 bg-clip-text">
                        Explore Language Communities
                    </h1>
                    
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-grow">
                            <FaSearch className="absolute top-3 left-3 text-indigo-500"/>
                            <input
                                type="text"
                                placeholder="Search languages"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 text-black w-full px-4 py-2 border-2 border-indigo-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <LoadingAnimation key="loader" />
                        ) : (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredLanguages.map((lang) => (
                                        <motion.div
                                            key={lang.id}
                                            whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-lg cursor-pointer transition duration-300 hover:from-indigo-100 hover:to-purple-100"
                                            onClick={() => joinCommunity(lang.name)}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xl font-semibold text-indigo-700">{lang.name}</span>
                                                <FaGlobe className="text-indigo-500 text-2xl" />
                                            </div>
                                            <p className="text-gray-600 mb-4">Join the {lang.name} community</p>
                                            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300 flex items-center justify-center">
                                                Join Now <FaArrowRight className="ml-2" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>

                                {filteredLanguages.length === 0 && (
                                    <p className="text-center text-gray-500 mt-8 text-lg">No languages found matching your search.</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </DotBackground>
    );
};

export default CommunitySelection;