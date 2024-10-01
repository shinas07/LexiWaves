import React, { useState } from 'react';
import { toast } from 'sonner';

const ChatBox = ({ tutorName }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() === '') return;

        // Here you would typically send the message to your backend
        // For demonstration, we'll just add it to the local state
        setMessages([...messages, { text: message, sender: 'You' }]);
        setMessage('');
        toast.success('Message sent to the tutor!'); // Show success message
    };

    return (
        <div className="fixed bottom-4 left-4 w-80 bg-white shadow-lg rounded-lg p-4">
            <h3 className="font-bold mb-2">Chat with {tutorName}</h3>
            <div className="h-48 overflow-y-auto border border-gray-300 p-2 mb-2">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-1 ${msg.sender === 'You' ? 'text-right' : ''}`}>
                        <span className={`font-semibold ${msg.sender === 'You' ? 'text-blue-500' : 'text-gray-800'}`}>
                            {msg.sender}:
                        </span> {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow border border-gray-300 rounded p-1"
                />
                <button type="submit" className="ml-2 bg-blue-500 text-white py-1 px-2 rounded">
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatBox;