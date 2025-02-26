import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, 
    LogOut, 
    Users, 
    Globe2, 
    MessageSquare, 
    Wifi, 
    WifiOff,
    MoreVertical,
    Settings,
    Bell
} from 'lucide-react';

const ChatRoom = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { username, language, email } = location.state || {};
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const socket = useRef(null);
    const chatContainerRef = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState(0);
    const [isTyping, setIsTyping] = useState(false); 

    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const handleOffline = () => {
            setIsOnline(false);
        };

        const handleOnline = () => {
            setIsOnline(true);
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    useEffect(() => {
        if (!username || !language) {
            navigate('/community-chat');
            return;
        }
        const token = localStorage.getItem('accessToken')
        socket.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${language}/?token=${token}`);


         // socket.current = new WebSocket(`wss://api.lexiwaves.online/ws/chat/${language}/?token=${token}`);
         
        // const wsUrl = process.env.NODE_ENV === 'production' 
        // ? `wss://api.lexiwaves.online/ws/chat/${language}/?token=${token}`
        // : `ws://127.0.0.1:8000/ws/chat/${language}/?token=${token}`;

        socket.current.onopen = () => {
            setIsConnected(true);
        };

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'chat_history') {
                setMessages(data.messages.map(msg => ({
                    ...msg,
                    timestamp: msg.timestamp ? new Date(msg.timestamp).toISOString() : new Date().toISOString()
                })));
            } else if (data.type === 'user_count') {
                setOnlineUsers(data.count);
            } else if (data.type === 'typing') {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 1000); // New typing status timeout
            } else {
                const newMessage = {
                    ...data,
                    timestamp: data.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString()
                };
                setMessages(prevMessages => [...prevMessages, newMessage]);
            }
        };

        socket.current.onclose = () => {
            setIsConnected(false);
        };

        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, [language, username, navigate]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && isConnected) {
            const newMessage = { 
                email, 
                username, 
                message: message.trim(), 
                timestamp: new Date().toISOString()
            };
            socket.current.send(JSON.stringify(newMessage));
            setMessage('');
        }
    };

    if (!username || !language) {
        return null;
    }

    return (
        <div className="h-screen bg-neutral-900 flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/[0.05] p-4 hidden md:flex flex-col">
                <div className="mb-8">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        LexiWaves Chat
                    </h2>
                </div>

                {/* Room Info */}
                <div className="p-4 bg-white/[0.03] rounded-2xl mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10">
                            <Globe2 className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium">{language}</h3>
                            <p className="text-sm text-neutral-400">Community Chat</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <Users className="w-4 h-4" />
                        <span>{onlineUsers} members online</span>
                    </div>
                </div>

                {/* Online Status */}
                <div className={`flex items-center gap-2 p-3 rounded-xl ${isOnline ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                    <span className="text-sm font-medium">{isOnline ? 'Connected' : 'Offline'}</span>
                </div>

                <div className="mt-auto">
                    <button 
                        onClick={() => navigate('/community-chat')}
                        className="w-full p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Leave Chat</span>
                    </button>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="border-b border-white/[0.05] p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-white font-medium">{username}</h3>
                                <p className="text-sm text-neutral-400">{email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-lg hover:bg-white/[0.05]">
                                <Bell className="w-5 h-5 text-neutral-400" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/[0.05]">
                                <Settings className="w-5 h-5 text-neutral-400" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                    <AnimatePresence initial={false}>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`group max-w-md ${
                                    msg.username === username 
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-white/[0.05] text-white'
                                } rounded-2xl p-4 space-y-2 hover:shadow-lg transition-all relative`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
                                            {msg.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-sm">{msg.username}</span>
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-lg">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm">{msg.message}</p>
                                    <div className="text-xs opacity-60">
                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { 
                                            hour: '2-digit', 
                                            minute: '2-digit',
                                            hour12: true
                                        }) : 'Just now'}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-neutral-400"
                        >
                            <div className="flex gap-1">
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.5 }}
                                    className="w-1.5 h-1.5 bg-neutral-400 rounded-full"
                                />
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                                    className="w-1.5 h-1.5 bg-neutral-400 rounded-full"
                                />
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                                    className="w-1.5 h-1.5 bg-neutral-400 rounded-full"
                                />
                            </div>
                            <span className="text-sm">Someone is typing...</span>
                        </motion.div>
                    )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-white/[0.05]">
                    <form onSubmit={sendMessage} className="flex items-center gap-4">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-white/[0.05] text-white placeholder-neutral-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                        <button
                            type="submit"
                            className="p-3 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
