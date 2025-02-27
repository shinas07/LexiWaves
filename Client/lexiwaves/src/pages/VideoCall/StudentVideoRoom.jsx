import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Shield, Clock, Users, BookOpen, Mic, Video, PhoneOff, 
  Settings, Maximize2, ScreenShare, MessageSquare, Grid,
  MicOff, VideoOff, LayoutGrid
} from 'lucide-react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import api from '../../service/api';
import { toast } from 'sonner';
AgoraRTC.setLogLevel(4);


const appid = import.meta.env.VITE_AGORA_APP_ID;

const client = AgoraRTC.createClient({ 
  mode: "rtc", 
  codec: "vp8",
  role: "host",
});

const VideoCallRoom = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [localTracks, setLocalTracks] = useState({ audio: null, video: null });
  const [remoteUsers, setRemoteUsers] = useState(new Map());
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [layout, setLayout] = useState('grid'); 
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let tracks = { audio: null, video: null };

    const init = async () => {
      try {
        
        const { data } = await api.get(`/video-call/agora-token/${requestId}`);
        
        if (!data.token || !data.channelName) {
          throw new Error('Invalid token or channel name');
        }

        // Create tracks
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        
        // Play local video track immediately
        const videoElement = document.getElementById('local-video');
        if (videoElement) {
          await videoTrack.play(videoElement);
        }

        tracks = { audio: audioTrack, video: videoTrack };
        setLocalTracks(tracks);
        setIsReady(true);

        // Setup event handlers
        client.on('user-published', handleUserPublished);
        client.on('user-unpublished', handleUserUnpublished);
        client.on('user-left', handleUserLeft);
        client.on('connection-state-change', handleConnectionStateChange);

        // Join channel
        await client.join(appid, data.channelName, data.token, null);
        await client.publish([audioTrack, videoTrack]);
        setConnectionStatus('connected');

      } catch (error) {
        toast.error('Failed to join video call');
      }
    };

    init();

    return () => {
      Object.values(tracks).forEach(track => {
        if (track) {
          track.stop();
          track.close();
        }
      });
      client.removeAllListeners();
      client.leave().catch(console.error);
    };
  }, [requestId, navigate]);

  const handleUserPublished = async (user, mediaType) => {
    try {
      await client.subscribe(user, mediaType);
      
      if (mediaType === 'video') {
        setRemoteUsers(prev => new Map(prev).set(user.uid, user));
      }
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
    } catch (error) {
      toast.error('Failed to connect to remote user');
    }
  };

  const handleUserUnpublished = (user, mediaType) => {
    if (mediaType === 'video') {
      setRemoteUsers(prev => {
        const next = new Map(prev);
        next.set(user.uid, user);
        return next;
      });
    }
  };

  const handleUserLeft = (user) => {
    setRemoteUsers(prev => {
      const next = new Map(prev);
      next.delete(user.uid);
      return next;
    });
  };

  const handleConnectionStateChange = (state) => {
    setConnectionStatus(state);
    if (state === 'DISCONNECTED') {
      toast.error('Connection lost');
    }
  };

  const toggleVideo = async () => {
    if (localTracks.video) {
      await localTracks.video.setEnabled(isVideoMuted);
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const toggleAudio = async () => {
    if (localTracks.audio) {
      await localTracks.audio.setEnabled(isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const startScreenShare = async () => {
    try {
      const screenTrack = await AgoraRTC.createScreenVideoTrack();
      await client.unpublish([localTracks.video]);
      await client.publish([screenTrack]);
      setIsScreenSharing(true);
      
      // Handle screen share stopped
      screenTrack.on('track-ended', () => {
        stopScreenShare();
      });
    } catch (error) {
      toast.error('Failed to share screen');
    }
  };

  const stopScreenShare = async () => {
    try {
      await client.unpublish([localTracks.screenShare]);
      await client.publish([localTracks.video]);
      setIsScreenSharing(false);
    } catch (error) {
      toast.error('Failed to stop screen sharing');
    }
  };

  const handleEndCall = async () => {
    try {
      // First turn off camera and mic
      if (localTracks.video) {
        await localTracks.video.setEnabled(false);
        localTracks.video.stop();
        localTracks.video.close();
      }
      if (localTracks.audio) {
        await localTracks.audio.setEnabled(false);
        localTracks.audio.stop();
        localTracks.audio.close();
      }

      // Stop screen share if active
      if (isScreenSharing) {
        await stopScreenShare();
      }

      // Clean up remote users
      remoteUsers.forEach(user => {
        if (user.videoTrack) {
          user.videoTrack.stop();
        }
        if (user.audioTrack) {
          user.audioTrack.stop();
        }
      });

      // Leave the channel
      await client.leave();
      
      toast.success('Call ended');
      navigate(`/review-session/${requestId}`);
    } catch (error) {
      toast.error('Error ending call');
      // Force navigate even if there's an error
      navigate(`/review-session/${requestId}`);
    } finally {
      // Reset all states
      setLocalTracks({ audio: null, video: null });
      setRemoteUsers(new Map());
      setIsScreenSharing(false);
      setIsAudioMuted(true);
      setIsVideoMuted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full bg-gray-800/90 hover:bg-gray-700/90 transition-all"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
        <button 
          onClick={toggleFullScreen}
          className="p-2 rounded-full bg-gray-800/90 hover:bg-gray-700/90 transition-all"
        >
          <Maximize2 className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className={`flex-1 ${showChat ? 'mr-[320px]' : ''}`}>
          <div className={`grid ${
            layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'
          } gap-4 p-4 h-full`}>
            {/* Local Video */}
            <div className={`relative rounded-xl overflow-hidden bg-gray-800 shadow-lg
                          ${layout === 'spotlight' ? 'col-span-2' : ''}`}>
              <div 
                id="local-video"
                className="h-full w-full object-cover"
                style={{ 
                  minHeight: layout === 'spotlight' ? '70vh' : '300px',
                  transform: 'scaleX(-1)'
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-white text-sm font-medium">You</span>
                </div>
                <div className="flex items-center gap-2">
                  {isAudioMuted && (
                    <div className="bg-red-500/90 p-1.5 rounded-lg">
                      <MicOff className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {isVideoMuted && (
                    <div className="bg-red-500/90 p-1.5 rounded-lg">
                      <VideoOff className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Remote Videos */}
            {Array.from(remoteUsers.values()).map(user => (
              <div key={user.uid} 
                   className="relative rounded-xl overflow-hidden bg-gray-800 shadow-lg">
                <div 
                  ref={node => {
                    if (node) {
                      node.innerHTML = '';
                      user.videoTrack?.play(node);
                    }
                  }}
                  className="h-full w-full object-cover"
                  style={{ minHeight: '300px' }}
                />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-white text-sm font-medium">Tutor</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="fixed right-0 top-0 bottom-0 w-[320px] bg-gray-800 border-l border-gray-700">
            {/* Chat implementation */}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-3 bg-gray-800/90 px-6 py-3 rounded-full shadow-lg">
          <button 
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-all ${
              !isAudioMuted ? 'bg-gray-700 text-white' : 'bg-red-500/20 text-red-500'
            }`}
          >
            {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button 
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all ${
              !isVideoMuted ? 'bg-gray-700 text-white' : 'bg-red-500/20 text-red-500'
            }`}
          >
            {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
          <button 
            onClick={startScreenShare}
            className={`p-4 rounded-full transition-all ${
              isScreenSharing ? 'bg-red-500/20 text-red-500' : 'bg-gray-700 text-white hover:bg-gray-700'
            }`}
          >
            {isScreenSharing ? <LayoutGrid className="w-5 h-5" /> : <ScreenShare className="w-5 h-5" />}
          </button>
          <button 
            onClick={handleEndCall}
            className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {!isReady && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p>Initializing video...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallRoom;