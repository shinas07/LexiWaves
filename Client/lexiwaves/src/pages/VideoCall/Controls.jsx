import React, { useState } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, ScreenShare, Settings } from 'lucide-react';

const Controls = ({ tracks, client, onLeave }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
      <div className="flex items-center gap-3 bg-gray-800/90 px-6 py-3 rounded-full 
                    shadow-lg backdrop-blur-sm border border-gray-700/50">
        {/* Audio Control */}
        <button 
          onClick={() => {
            tracks[0].setEnabled(!isMuted);
            setIsMuted(!isMuted);
          }}
          className={`p-4 rounded-full transition-all duration-200 flex items-center gap-2
            ${isMuted 
              ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Video Control */}
        <button 
          onClick={() => {
            tracks[1].setEnabled(!isVideoOff);
            setIsVideoOff(!isVideoOff);
          }}
          className={`p-4 rounded-full transition-all duration-200 flex items-center gap-2
            ${isVideoOff 
              ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>

        {/* Screen Share */}
        <button 
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={`p-4 rounded-full transition-all duration-200
            ${isScreenSharing 
              ? 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
        >
          <ScreenShare className="w-5 h-5" />
        </button>

        {/* Settings */}
        <button 
          className="p-4 rounded-full bg-gray-700 text-white 
                   hover:bg-gray-600 transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
        </button>

        <div className="w-px h-8 bg-gray-700" /> {/* Divider */}

        {/* End Call */}
        <button 
          onClick={onLeave}
          className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 
                   transition-all duration-200 flex items-center gap-2"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Controls;