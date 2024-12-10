import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { PlayCircle, Pause, RotateCcw, Maximize, Minimize } from 'lucide-react';
import api from '../../service/api';
import { DotBackground } from '../../components/Background';

const CourseVideo = () => {
  const { id } = useParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await api.get(`/user/courses/video/${id}`);
        setVideoUrl(response.data.video_url);
        setLoading(false);
      } catch (err) {
        setError('Failed to load video');
        setLoading(false);
      }
    };

    fetchVideoUrl();
  }, [id]);

  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) { // Firefox
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.webkitRequestFullscreen) { // Chrome, Safari and Opera
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) { // IE/Edge
        containerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-500 text-white p-4 rounded-lg mt-8 mx-auto max-w-md">
      <h2 className="text-lg font-bold mb-2">Error</h2>
      <p>{error}</p>
    </div>
  );

  return (
    <DotBackground>
      <div className="max-w-7xl mx-auto p-6 mt-16">
        <h1 className="text-4xl font-bold mb-6 text-white">{course.title}</h1>
        <div className="mb-6 relative" ref={containerRef}>
          <video 
            ref={videoRef}
            className="w-full rounded-lg shadow-md" 
            src={videoUrl}
            type="video/mp4"
            controls
          />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black bg-opacity-50 rounded-lg p-2">
            <button onClick={handlePlayPause} className="text-white hover:text-blue-500 transition-colors">
              {isPlaying ? <Pause size={24} /> : <PlayCircle size={24} />}
            </button>
            <button onClick={handleRestart} className="text-white hover:text-blue-500 transition-colors">
              <RotateCcw size={24} />
            </button>
            <button onClick={toggleFullscreen} className="text-white hover:text-blue-500 transition-colors">
              {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Course Description</h2>
          <p className="text-gray-300">{course.description}</p>
        </div>
        {course.chapters && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Course Chapters</h2>
            <ul className="space-y-2">
              {course.chapters.map((chapter, index) => (
                <li key={index} className="flex items-center text-gray-300">
                  <span className="mr-2 text-blue-500">{index + 1}.</span>
                  {chapter}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DotBackground>
  );
};

export default CourseVideo;