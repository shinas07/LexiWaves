import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGlobe, FaUser, FaArrowRight, FaSearch } from 'react-icons/fa';
import api from '../../service/api';

const CommunitySelection = () => {
    const [username, setUsername] = useState('');
    const [languages, setLanguages] = useState([]);
    const [filteredLanguages, setFilteredLanguages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch languages from backend
        const fetchLanguages = async () => {
            try {
                const response = await api.get('/chat/coummunity-chat-rooms/'); // Adjust the endpoint as needed
                setLanguages(response.data);
                console.log(response.data)
                
                setFilteredLanguages(response.data);
            } catch (error) {
                console.error('Error fetching languages:', error);
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
            navigate(`/chat/${language}`, { state: { username, language } });
        } else {
            alert('Please enter a username before joining a community.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full"
            >
                <h1 className="text-4xl font-bold text-center mb-6 text-indigo-700">Join a Language Community</h1>
                
                <div className="mb-6">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <div className="relative text-gray-700">
                        <FaUser className="absolute top-3 left-3 text-gray-400"/>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <div className="relative text-gray-700">
                        <FaSearch className="absolute top-3 left-3 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Search languages"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredLanguages.map((lang) => (
                        <motion.div
                            key={lang.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-indigo-50 p-4 rounded-lg shadow cursor-pointer"
                            onClick={() => joinCommunity(lang.name)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-medium text-indigo-700">{lang.name}</span>
                                <FaGlobe className="text-indigo-500" />
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Join the {lang.name} community</p>
                        </motion.div>
                    ))}
                </div>

                {filteredLanguages.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">No languages found matching your search.</p>
                )}
            </motion.div>
        </div>
    );
};

export default CommunitySelection;