import React, { useState, useEffect } from 'react';
import { Video, Clock, CheckCircle, XCircle, Star } from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
} from '../../../components/UserIntractionUI';
import api from '../../../service/api';
import { useNavigate } from 'react-router-dom';

const VideoCallSection = ({ tutorId, courseId, setParentCount }) => {
  const [requestStatus, setRequestStatus] = useState('idle');
  const [existingRequest, setExistingRequest] = useState(null);
  const [timeUntilCall, setTimeUntilCall] = useState(null);
  const [showJoinButton, setShowJoinButton] = useState(false);
  const navigate = useNavigate()
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const checkExistingRequest = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await api.get(`/video-call/check-request/`, {
          params: { tutorId, courseId }
        });
        
        if (response.data.request) {
          setExistingRequest(response.data.request);
          setParentCount(response.data.count)
          setRequestStatus(response.data.request.status);
        }
      } catch (error) {
        toast.error('Error checking request:');
      }
    };

    checkExistingRequest();
  }, [tutorId, courseId]);

  useEffect(() => {
    const checkAndUpdateExpiredStatus = async () => {
      if (!existingRequest) return;
      
      const isCallExpired = new Date(existingRequest.scheduled_time).getTime() + (60 * 60 * 1000) < new Date().getTime();
      
      if (isCallExpired && existingRequest.status === 'accepted') {
        try {
          await api.post(`/video-call/mark-expired/${existingRequest.id}/`);
          checkExistingRequest(); // Refresh the request data
          setIsExpired(true);
        } catch (error) {
          console.error('Failed to mark call as expired:', error);
        }
      }
    };

    checkAndUpdateExpiredStatus();
  }, [existingRequest?.scheduled_time, existingRequest?.status]);

  const handleVideoRequest = async () => {
    try {
      setRequestStatus('requesting');
      const token = localStorage.getItem('accessToken');

      const response = await api.post('/video-call/request/', {
        tutorId,
        courseId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setExistingRequest(response.data.request);
      setRequestStatus('pending');
      toast.success('Request sent! Tutor will respond in chat.');

    } catch (error) {
      setRequestStatus('idle');
      if (error.response?.status === 400) {
        toast.error(error.response.data.detail || 'Failed to send request');
      } else {
        toast.error('Failed to send request');
      }
    }
  };

  const calculateTimeRemaining = (scheduledTime) => {
    const now = new Date().getTime();
    const callTime = new Date(scheduledTime).getTime();
    const difference = callTime - now;

    const joinWindowOpen = difference <= 5 * 60 * 1000;
    
    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      return { hours, minutes, joinWindowOpen };
    }
    
    return { hours: 0, minutes: 0, joinWindowOpen: true };
  };

  useEffect(() => {
    if (existingRequest?.status === 'accepted' && existingRequest.scheduled_time) {
      const timer = setInterval(() => {
        const { hours, minutes, joinWindowOpen } = calculateTimeRemaining(existingRequest.scheduled_time);
        
        if (joinWindowOpen) {
          setShowJoinButton(true);
          setTimeUntilCall(null);
          clearInterval(timer);
        } else {
          setTimeUntilCall({ hours, minutes });
          setShowJoinButton(false);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [existingRequest]);

  const renderRequestStatus = () => {
    if (existingRequest) {
      switch (existingRequest.status) {
        case 'pending':
          return (
            <div className="text-center py-8">
              <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">
                Request Pending
              </h4>
              <p className="text-gray-400">
                Waiting for tutor's response
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Requested on: {new Date(existingRequest.created_at).toLocaleDateString()}
              </p>
            </div>
          );
        case 'accepted':
          return renderAcceptedStatus();
        case 'declined':
          return (
            <div className="text-center py-8">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-200 mb-2">
                Request Declined
              </h4>
              <p className="text-gray-300 mb-4">
                Your tutor was unable to accept this request.
              </p>
              <button
  onClick={() => setRequestStatus('idle')}
  className="group relative inline-flex items-center justify-center px-6 py-3 
             overflow-hidden font-bold text-white rounded-lg 
             bg-gradient-to-br from-blue-600 to-blue-800 
             hover:from-blue-700 hover:to-blue-900
             transition-all duration-300 ease-out
             shadow-md hover:shadow-lg"
>
  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
  <span>Start New Video Request</span>
</button>
            </div>
          );
        case 'completed':
          return (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-200 mb-2">
                Session Completed
              </h4>
              <div className="space-y-3">
                
                {/* {!existingRequest.is_reviewed && (
                  <div className="mt-4">
                    <Button
                      onClick={() => navigate(`/review-session/${existingRequest.id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 
                               rounded-lg flex items-center gap-2 mx-auto"
                    >
                      <Star className="w-5 h-5" />
                      Leave Review
                    </Button>
                  </div>
                )} */}

                <Button
                  // onClick={() => setRequestStatus('idle')}
                  onClick={handleVideoRequest}
                  className="mt-2 border border-gray-300 hover:bg-gray-50 
                           px-6 py-2 rounded-lg"
                >
                  Request For New Session
                </Button>
              </div>
            </div>
          );
      }
    }

    if (requestStatus === 'idle') {
      return (
        <div className="text-center py-8">
          <Video className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium mb-2">
            Start a Video Session
          </h4>
          <p className="text-gray-600 mb-6">
            Send a request to your tutor for a video call session.
            They will respond through chat to schedule a time.
          </p>
          <Button
            onClick={handleVideoRequest}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg
                     flex items-center gap-2 mx-auto"
          >
            <Video className="w-5 h-5" />
            Request Video Call
          </Button>
        </div>
      );
    }

    if (requestStatus === 'requesting') {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h4 className="text-lg font-medium text-gray-800">
            Sending Request...
          </h4>
        </div>
      );
    }

    if (requestStatus === 'sent') {
      return (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            Request Sent Successfully!
          </h4>
          <div className="space-y-2 text-gray-600">
            <p>Your tutor will respond shortly through chat.</p>
            <p className="flex items-center justify-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              Expected response time: 5-10 minutes
            </p>
          </div>
          <Button
            onClick={() => setRequestStatus('idle')}
            className="mt-6 border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-lg"
          >
            Send Another Request
          </Button>
        </div>
      );
    }
  };
  

  const renderAcceptedStatus = () => {
    // First check if call is completed
    if (existingRequest.status === 'completed') {
      return (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            Session Completed
          </h4>
          <p className="text-gray-600 mb-6">
            This session was completed on: {' '}
            {new Date(existingRequest.completed_at).toLocaleString()}
          </p>
          
          <Button
            onClick={() => handleVideoRequest()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 
                     rounded-lg flex items-center gap-2 mx-auto"
          >
            <Video className="w-5 h-5" />
            Request New Session
          </Button>
        </div>
      );
    }

    // Check for expired status
    console.log(existingRequest.scheduledTime)
    const isCallExpired = new Date(existingRequest.scheduled_time).getTime() + (60 * 60 * 1000) < new Date().getTime();
    
    if (isCallExpired || isExpired) {
      return (
        <div className="text-center py-8">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            Previous Session Expired
          </h4>
          <p className="text-gray-600 mb-6">
            Scheduled time: {new Date(existingRequest.scheduled_time).toLocaleString()}
          </p>
          
          <Button
            onClick={() => handleVideoRequest()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 
                     rounded-lg flex items-center gap-2 mx-auto"
          >
            <Video className="w-5 h-5" />
            Request New Session
          </Button>
        </div>
      );
    }

    // Regular render for active scheduled calls
    return (
      <div className="text-center  py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-200 mb-2">
          Call Scheduled!
        </h4>
        <p className="text-gray-300 mb-4">
          Scheduled for: {new Date(existingRequest.scheduled_time).toLocaleString()}
        </p>
        
        {timeUntilCall && (
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-2">Time until call:</p>
            <div className="text-2xl font-bold text-blue-500">
              {timeUntilCall.hours}h {timeUntilCall.minutes}m
            </div>
          </div>
        )}

        {showJoinButton ? (
          <Button
            onClick={() => navigate( `/video-call-room/${existingRequest.id}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3
                     rounded-lg flex items-center justify-center gap-2 mx-auto
                     animate-pulse"
          >
            <Video className="w-5 h-5" />
            Join Call Now
          </Button>
        ) : (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Coming Soon!</span>
            </div>
            <p className="text-sm text-gray-400">
              The video call room will be available 5 minutes before your scheduled time. 
              Please check back soon.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="shadow-xl rounded-xl  overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-800 text-white p-6">
        <h3 className="text-xl font-semibold">Video Session</h3>
        <p className="text-gray-400 mt-1">
          Connect with your tutor through video call
        </p>
      </CardHeader>

      <CardContent className="p-6 bg-gray-900">
        {renderRequestStatus()}
      </CardContent>
    </Card>
  );
};

export default VideoCallSection;