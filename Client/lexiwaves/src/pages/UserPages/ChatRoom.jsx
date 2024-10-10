import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaUser } from 'react-icons/fa';

const ChatRoom = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { username, language } = location.state || {};
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const socket = useRef(null);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (!username || !language) {
            navigate('/communities');
            return;
        }

        // Connect to WebSocket server
        // socket.current = new WebSocket(`ws://localhost:8000/ws/chat/${language}/`);
        socket.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${language}/`);

        socket.current.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket Connected');
        };

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, { username: data.username, message: data.message }]);
        };

        socket.current.onerror = (error) => {
            console.error('WebSocket Error:', error);
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
        // Scroll to bottom of chat
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && isConnected) {
            const newMessage = { username, message: message.trim() };
            socket.current.send(JSON.stringify(newMessage));
            setMessage('');
        }
    };

    if (!username || !language) {
        return null; // or a loading spinner
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="bg-indigo-600 text-white p-4">
                <h1 className="text-2xl font-bold">{language} Community Chat</h1>
                <p>Welcome, {username}!</p>
            </header>

            <div className="flex-grow p-4 overflow-hidden">
                <div ref={chatContainerRef} className="h-full overflow-y-auto bg-white rounded-lg shadow p-4">
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-2 ${msg.username === username ? 'text-right' : 'text-left'}`}
                        >
                            <span className="font-bold">{msg.username}: </span>
                            <span>{msg.message}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-white border-t">
                <form onSubmit={sendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow p-2 border rounded"
                        disabled={!isConnected}
                    />
                    <button 
                        type="submit" 
                        className="bg-indigo-600 text-white p-2 rounded disabled:bg-gray-400"
                        disabled={!isConnected}
                    >
                        <FaPaperPlane />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatRoom;