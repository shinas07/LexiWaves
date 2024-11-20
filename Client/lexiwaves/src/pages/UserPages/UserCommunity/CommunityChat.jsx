import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2, Search, ArrowRight, Users, MessageCircle } from 'lucide-react';
import api from '../../../service/api';
import { DotBackground } from '../../../components/Background';
import FloatingNavbar from '../../../components/Navbar';
import { toast } from 'sonner';

const LoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
        <motion.div
            className="w-20 h-20 rounded-full border-4 border-neutral-700"
            style={{ borderTopColor: '#6366f1' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-neutral-400 font-medium"
        >
            Loading communities...
        </motion.p>
    </div>
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
                const token = localStorage.getItem('accessToken'); 
                const response = await api.get('/chat/user-details', {
                    headers: {
                        Authorization: `Bearer ${token}` 
                    }
                });
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
            <div className="min-h-screen pt-32 px-4 pb-16">
                {/* Hero Section */}
                <div className="max-w-6xl mx-auto mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                            <Users className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm text-neutral-300">
                                Join {languages.length}+ Language Communities
                            </span>
                        </div>
                        
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                            Connect with Language Enthusiasts
                        </h1>
                        
                        <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                            Join vibrant communities of language learners, share experiences, and practice with native speakers.
                        </p>
                    </motion.div>
                </div>

                {/* Search Section */}
                <div className="max-w-6xl mx-auto mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search language communities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-14 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                        />
                    </motion.div>
                </div>

                {/* Communities Grid */}
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <LoadingAnimation key="loader" />
                        ) : (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filteredLanguages.map((lang, index) => (
                                    <motion.div
                                        key={lang.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ 
                                            opacity: 1, 
                                            y: 0,
                                            transition: { delay: index * 0.1 }
                                        }}
                                        whileHover={{ y: -5 }}
                                        className="group relative"
                                    >
                                        {/* Glow Effect */}
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
                                        
                                        {/* Card Content */}
                                        <div 
                                            onClick={() => joinCommunity(lang.name)}
                                            className="relative p-6 bg-neutral-900/50 backdrop-blur-sm border border-white/[0.05] rounded-2xl cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between mb-6">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-white mb-2">
                                                        {lang.name}
                                                    </h3>
                                                    <p className="text-neutral-400 text-sm">
                                                        Connect with {lang.name} speakers
                                                    </p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-white/5 border border-white/[0.05]">
                                                    <Globe2 className="w-6 h-6 text-indigo-400" />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="flex -space-x-2">
                                                    {[...Array(3)].map((_, i) => (
                                                        <div 
                                                            key={i}
                                                            className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center"
                                                        >
                                                            <Users className="w-4 h-4 text-neutral-500" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="p-3 rounded-xl bg-white/5 border border-white/[0.05]">
                                                    <MessageCircle className="w-6 h-6 text-indigo-400" />
                                                </div>
                                            </div>

                                            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300 flex items-center justify-center">
                                                Join Now <ArrowRight className="ml-2" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </DotBackground>
    );
};

export default CommunitySelection;