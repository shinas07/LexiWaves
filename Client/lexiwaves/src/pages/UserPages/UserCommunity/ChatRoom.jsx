import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaSignOutAlt, FaUsers, FaGlobe, FaUserCircle } from 'react-icons/fa';
import Avatar from 'react-avatar';

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
    const [isTyping, setIsTyping] = useState(false); // New typing indicator state

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
        socket.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${language}/`);

        socket.current.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket Connected');
        };

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'chat_history') {
                setMessages(data.messages.map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                })));
            } else if (data.type === 'user_count') {
                setOnlineUsers(data.count);
            } else if (data.type === 'typing') {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 1000); // New typing status timeout
            } else {
                const newMessage = {
                    ...data,
                    timestamp: new Date(data.timestamp)
                };
                setMessages(prevMessages => [...prevMessages, newMessage]);
            }
        };

        socket.current.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket Disconnected');
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
        <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
            <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <FaGlobe className="text-3xl mr-3 text-indigo-200" />
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold">{language} Community Chat</h1>
                                <p className="text-indigo-200 mt-1 flex items-center">
                                    <FaUsers className="mr-2" />
                                    {onlineUsers} online • Welcome, {username}!
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                        <div className={`bg-${isOnline ? 'green' : 'red'}-500 px-3 py-1 rounded-full text-sm flex items-center`}>
                                <span className={`w-2 h-2 bg-${isOnline ? 'green' : 'red'}-400 rounded-full mr-2`}></span>
                                {isOnline ? 'Online' : 'Offline'}
                            </div>
                            <button 
                                onClick={() => navigate('/community-chat')}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out flex items-center text-sm font-medium"
                            >
                                <FaSignOutAlt className="mr-2" /> Leave Chat
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            
            <div className="flex-grow p-6 overflow-hidden">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl h-full flex flex-col">
                    <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'} mb-2`}
                            >
                                <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                                    msg.username === username 
                                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-l-lg rounded-br-lg'
                                        : 'bg-gray-200 text-gray-800 rounded-r-lg rounded-bl-lg'
                                } p-4 shadow-lg relative flex flex-col break-words transition-transform transform hover:scale-105`}>
                                    <div className="flex items-center mb-1">
                                        <Avatar name={msg.username} size="30" round={true} className="mr-2" />
                                        <p className="font-semibold text-sm">{msg.username}</p>
                                    </div>
                                    <p className="text-base">{msg.message}</p>
                                    {msg.timestamp && !isNaN(new Date(msg.timestamp)) && (
                                        <p className="text-xs text-gray-500 mt-1 self-end">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {isTyping && (
                            <div className="text-gray-500 text-sm italic">
                                Someone is typing...
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <form onSubmit={sendMessage} className="flex items-center space-x-3">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full py-3 px-4 rounded-full bg-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-gray-700"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300 ease-in-out rounded-full p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <FaPaperPlane />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

          
        </div>
    );
};

export default ChatRoom;
