import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, ArrowLeft, Clock, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../../service/api';
import TutorDashboardLayout from '../TutorDashboardLayout';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const VideoCallManagement = () => {

  const { studentId, courseId } = useParams();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [customTime, setCustomTime] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVideoRequests();
  }, [studentId, courseId]);

  const fetchVideoRequests = async () => {
    try {
        
      const response = await api.get(`/video-call/student/call-request/${studentId}/`, {
        params: { course: courseId }
      });
      setRequests(response.data.requests);
    } catch (error) {
      toast.error('Error fetching video requests');
    }
  };

  const handleAcceptClick = (request) => {
    setSelectedRequest(request);
    console.log(request.id)
    setActiveRequestId(request.id);
    setShowTimeModal(true);
  };

  const handleTimeSelection = async (time) => {
    setIsLoading(true);
    try {
        const response = await api.post(`/video-call/handle-request/${activeRequestId}/`, {
            action: 'accept',
            scheduled_time: time.toISOString()
        });
        
        toast.success('Video call scheduled! Confirmation emails will be sent shortly.');
        setShowTimeModal(false);
        fetchVideoRequests();
    } catch (error) {
        toast.error('Failed to schedule video call');
        console.error('Error:', error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await api.post(`/video-call/handle-request/${requestId}/`, {
        action: 'decline'
      });
      toast.success('Request declined');
      fetchVideoRequests();
    } catch (error) {
      toast.error('Failed to decline request');
    }
  };

  const handleJoinCall = (requestId) => {
    console.log(requestId)
    navigate(`/tutor/video-call-room/${requestId}`);
  };
  

  return (
    <TutorDashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-400"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">
            Video Call Requests
          </h1>
        </div>

        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-16 bg-gray-800/50 rounded-2xl">
              <Video className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">
                No Video Call Requests
              </h3>
              <p className="text-gray-400 max-w-sm mx-auto">
                You don't have any video call requests at the moment. 
                New requests from students will appear here.
              </p>
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="bg-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-semibold text-white mb-2">
                      Request from {request.first_name}
                    </p>
                    <p className="text-sm text-gray-400">
                      Status: <span className="capitalize">{request.status}</span>
                    </p>
                    <p className="text-sm text-gray-400">
                      Requested: {new Date(request.created_at).toLocaleString()}
                    </p>
                    {request.scheduled_time && (
                      <div className="mt-2">
                        <p className="text-sm text-green-400">
                          Scheduled for: {new Date(request.scheduled_time).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptClick(request)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Schedule Call
                      </button>
                      <button
                        onClick={() => handleDecline(request.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {request.status === 'accepted' && (
                    <button
                        onClick={() => {
                            console.log('Joining call for request:', request);
                            handleJoinCall(request.id);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Join Call
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Time Selection Modal */}
        {showTimeModal && selectedRequest && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Schedule Video Call</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Select your preferred date and time
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setShowTimeModal(false);
                    setSelectedRequest(null);
                    setCustomTime('');
                  }}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* DateTime Picker */}
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <h3 className="text-white font-medium">Select Date & Time</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <DatePicker
                    selected={customTime ? new Date(customTime) : null}
                    onChange={(date) => setCustomTime(date.toISOString())}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select date and time"
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg
                             border border-gray-600 focus:border-blue-500 focus:ring-1 
                             focus:ring-blue-500 outline-none transition-colors"
                    calendarClassName="custom-calendar"
                    wrapperClassName="w-full"
                    popperClassName="custom-popper"
                    showPopperArrow={false}
                  />
                </div>

                <p className="text-sm text-gray-400 mt-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Session duration: 1 hour
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowTimeModal(false);
                    setSelectedRequest(null);
                    setCustomTime('');
                  }}
                  className="px-4 py-3 bg-gray-700 text-white rounded-xl
                           hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleTimeSelection(new Date(customTime))}
                  disabled={isLoading}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl
                           hover:bg-blue-700 disabled:opacity-90 disabled:cursor-not-allowed
                           transition-all duration-200 font-medium flex items-center justify-center gap-2 relative"
                >
                  {isLoading ? (
                    <>
                      <div className="absolute inset-0 bg-blue-600 rounded-xl flex items-center justify-center">
                        <svg 
                          className="animate-spin h-5 w-5 text-white" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24"
                        >
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                          />
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span className="ml-2">Scheduling...</span>
                      </div>
                      <span className="opacity-0">
                        <Clock className="h-4 w-4" />
                        Schedule Call
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4" />
                      Schedule Call
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .react-datepicker {
          background-color: #1f2937 !important;
          border: 1px solid #374151 !important;
          border-radius: 0.75rem !important;
          font-family: inherit !important;
          overflow: hidden;
        }

        .react-datepicker__header {
          background-color: #111827 !important;
          border-bottom: 1px solid #374151 !important;
          padding: 1rem !important;
        }

        .react-datepicker__current-month,
        .react-datepicker__day-name,
        .react-datepicker-time__header {
          color: white !important;
        }

        .react-datepicker__day {
          color: #d1d5db !important;
          border-radius: 0.5rem !important;
          margin: 0.2rem !important;
        }

        .react-datepicker__day:hover {
          background-color: #374151 !important;
        }

        .react-datepicker__day--selected {
          background-color: #3b82f6 !important;
          color: white !important;
        }

        .react-datepicker__time-container {
          border-left: 1px solid #374151 !important;
        }

        .react-datepicker__time-list-item {
          color: #d1d5db !important;
          height: auto !important;
          padding: 0.5rem !important;
        }

        .react-datepicker__time-list-item:hover {
          background-color: #374151 !important;
        }

        .react-datepicker__time-list-item--selected {
          background-color: #3b82f6 !important;
        }

        .custom-popper {
          z-index: 9999 !important;
        }

        .react-datepicker__navigation-icon::before {
          border-color: #d1d5db !important;
        }

        .react-datepicker__day--keyboard-selected {
          background-color: #3b82f6 !important;
        }

        .react-datepicker__time-container 
        .react-datepicker__time 
        .react-datepicker__time-box {
          width: 100px !important;
        }

        .react-datepicker__navigation {
          top: 1rem !important;
        }

        .react-datepicker__day--outside-month {
          color: #6b7280 !important;
        }
      `}</style>
    </TutorDashboardLayout>
  );
};

export default VideoCallManagement;