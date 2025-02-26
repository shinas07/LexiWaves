import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../../service/api';
import {
  Send,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import TutorDashboardLayout from '../TutorDashboardLayout';

const TutorChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const messagesEndRef = useRef(null);
  const websocket = useRef(null);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState()
 

  
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
        } catch (error) {
          toast.error('Failed to load UserName');
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }, []);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const token = localStorage.getItem('accessToken');
        // Create WebSocket connection
        // const wsUrl = `ws://127.0.0.1:8000/ws/classchat/${roomId}/?token=${token}`;
        const wsUrl = `wss://api.lexiwaves.online/ws/classchat/${roomId}/?token=${token}`;
        websocket.current = new WebSocket(wsUrl);

        websocket.current.onopen = () => {
          setConnectionStatus('connected');
        };

        websocket.current.onclose = () => {
          setConnectionStatus('disconnected');
          // Try to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        websocket.current.onerror = (error) => {
          console.error('WebSocket Error:', error);
          setConnectionStatus('error');
          // toast.error('hkjk error');
        };

        websocket.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'chat_message') {
              setMessages(prev => [...prev, {
                id: Date.now(),
                message: data.message,
                email: data.email,
                timestamp: data.timestamp || new Date().toISOString()
              }]);
              scrollToBottom();
            } else if (data.type === 'chat_history') {
              setMessages(data.messages);
              scrollToBottom();
            }
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };
      } catch (error) {
        console.error('Error creating WebSocket:', error);
        setConnectionStatus('error');
      }
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, [roomId]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || connectionStatus !== 'connected') return;
    try {
      const messageObj = {
        type: 'chat_message',
        message: newMessage.trim(),
        email: email,
      };

      websocket.current.send(JSON.stringify(messageObj));
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <TutorDashboardLayout>
      <div className='flex justify-center'>
    <div className="flex flex-col h-[calc(100vh-80px)] w-[80%] bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl">
      {/* Enhanced Header */}
      <div className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 p-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-700/50 text-gray-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-white">Educational Chat Room</h2>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></span>
                <p className="text-sm text-gray-400">
                  {connectionStatus === 'connected' ? 'Live Session' : 'Reconnecting...'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Add session info */}
          <div className="hidden md:block text-right">
            <p className="text-sm text-gray-400">Course Session</p>
            <p className="text-xs text-gray-500">{formatTime(new Date())}</p>
          </div>
        </div>
      </div>

        {/* Connection Status */}
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
        

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto scrollbar" ref={messagesEndRef}>
          <div className="max-w-5xl mx-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex ${message.email === email ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[70%] ${message.email === email ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {message.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.email === email
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-gray-800 text-gray-100 rounded-tl-none'
                    }`}>
                      <p>{message.message}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                      message.email === email ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-gray-800/90 backdrop-blur-sm border-t border-gray-700/50 p-4">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center gap-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={connectionStatus !== 'connected'}
              placeholder="Type your question or response..."
              className="flex-1 bg-gray-700/50 text-white rounded-2xl px-6 py-4
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                       placeholder-gray-400 transition-all text-base
                       disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={connectionStatus !== 'connected' || !newMessage.trim()}
              className="p-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       transition-all duration-200 ease-in-out
                       transform hover:scale-105 active:scale-95
                       flex items-center gap-2"
            >
              <Send className="h-5 w-5" />
              <span className="hidden md:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
      </div>
      </div>
    </TutorDashboardLayout>
  );
};

export default TutorChatRoom;