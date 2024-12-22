import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import api from '../../../service/api';
import Loader from '../../Loader';
import { Send as SendIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  }
  
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    })}`;
  }
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ChatSection = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const websocket = useRef(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken'); 
        const response = await api.get('/chat/user-details', {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        setEmail(response.data.email);
        setUsername(response.data.email);
      } catch (error) {
        toast.error('Failed to load UserName');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const disconnectWebSocket = () => {
    if (websocket.current && isConnected) {
      websocket.current.close(1000, 'User left the chat');
      websocket.current = null;
      setIsConnected(false);
    }
  };

  const connectWebSocket = () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token || !roomId) return;

      websocket.current = new WebSocket(`ws://127.0.0.1:8000/ws/classchat/${roomId}/`);

      websocket.current.onopen = () => {
        console.log('WebSocket Connected');
        setIsConnected(true);
        setConnectionStatus('connected');
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
      };

      websocket.current.onclose = (event) => {
        console.log('WebSocket Closed:', event.code);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        if (event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
        }
      };

      websocket.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
        setConnectionStatus('error');
      };

      websocket.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
     
          if (data.type === 'chat_message') {
            setMessages(prev => [...prev, {
              message: data.message,
              email: data.email,
              timestamp: data.message.timestamp || new Date().toISOString()
            }]);
          } else if (data.type === 'chat_history') {
            setMessages(data.messages.map(msg => ({
              ...msg,
              timestamp: msg.timestamp || new Date().toISOString()
            })));
          }
        } catch (error) {
          console.error('Error parsing message:');
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setConnectionStatus('error');
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (websocket.current) {
        websocket.current.close(1000, 'Component unmounting');
        websocket.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [roomId]);

  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (websocket.current?.readyState === WebSocket.OPEN) {
        websocket.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);

    return () => clearInterval(pingInterval);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isConnected) {
        connectWebSocket();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isConnected]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && websocket.current?.readyState === WebSocket.OPEN) {
      try {
        const messageData = {
          type: 'chat_message',
          message: message.trim(),
          email: email
        };
        websocket.current.send(JSON.stringify(messageData));

        setMessage('');
      } catch (error) {
        toast.error('Error Sending Message');
      }
    }
  };
  

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col h-[500px] bg-gray-900 rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-1">Chat Session</h2>
        <p className="text-gray-400 text-sm">
          Connect with your tutor through instant messaging for interactive learning
        </p>
      </div>

      {connectionStatus !== 'connected' && (
        <div className={`p-2 text-center ${
          connectionStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-400' :
          connectionStatus === 'error' ? 'bg-red-500/20 text-red-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {connectionStatus === 'connecting' ? 'Connecting...' :
           connectionStatus === 'error' ? 'Connection error' :
           'Disconnected - Reconnecting...'}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 scrollbar ">
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`mb-2 ${msg.email === email ? 'text-right' : ''}`}
          >
            <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
              msg.email === email 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-200'
            }`}>
              <p className="mb-1">{msg.message}</p>
              <div className={`text-xs ${
                msg.email === email 
                  ? 'text-blue-100/70' 
                  : 'text-gray-400'
              }`}>
                
                {formatMessageTime(msg.timestamp)}
              
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={connectionStatus !== 'connected'}
            className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-blue-500"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            disabled={connectionStatus !== 'connected' || !message.trim()}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatSection;