import React, { useState, useEffect } from 'react';
import { Video, MessageSquare, Crown, Clock, AlertCircle } from 'lucide-react';
import { DotBackground } from '../../../components/Background';
import { Button, Badge, Progress, Card, CardHeader, CardContent, CardFooter, Alert, Separator } from '../../../components/UserIntractionUI';
import VideoCallSection from './VideoCallMange';
import api from '../../../service/api';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../Loader';
import ChatSection from './Chat';
import FloatingNavbar from '../../../components/Navbar';

const UserConnection = () => {
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [callCount, setCallCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [tutorDetails, setTutorDetails] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [roomExists, setRoomExists] = useState(false);
  const location = useLocation();
  const tutorId = location.state?.tutorId;
  const courseId = location.state?.courseId;
  const MAX_FREE_CALLS = 3;

  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get(`student/tutor-interaction/${tutorId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTutorDetails(response.data);
      } catch (error) {

        console.error("Error fetching tutor details:", error);
      }
    };

    if (tutorId) {
      fetchTutorDetails();
    }
  }, [tutorId]);

  useEffect(() => {
    const checkOrCreateRoom = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`interaction/room/${tutorId}/${courseId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        

        
        if (response.data.exists) {
          setRoomId(response.data.room_id);
        } else {
          setRoomId(response.data.room_id);
          setRoomName(response.data.room_name);
        }
        setRoomExists(response.data.exists);
      } catch (error) {
        console.error("Error checking or creating room:", error);
      }
    };

    if (tutorId) {
      checkOrCreateRoom();
    }
  }, [tutorId, courseId]);

  useEffect(() => {
    const savedCalls = parseInt(localStorage.getItem('callCount') || '0', 10);
    setCallCount(savedCalls);
  }, []);

  const handleVideoCallRequest = () => {
    if (callCount < MAX_FREE_CALLS) {
      setShowVideoCall(true);
      setCallCount((prevCount) => {
        const newCount = prevCount + 1;
        localStorage.setItem('callCount', String(newCount));
        return newCount;
      });
    } else {
      setShowAlert(true);
    }
  };

  if (!tutorDetails)
     return(
     <DotBackground>
      <div><Loader/></div>
     </DotBackground>
     );

  return (
    <DotBackground>
      <FloatingNavbar/>
      <div className="min-h-screen mt-12 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 bg-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white text-xl font-bold"
                    style={{ backgroundImage: `url(${tutorDetails.profile_image})`, backgroundSize: 'cover' }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{tutorDetails.first_name} {tutorDetails.last_name}</h3>
                    <div className="flex items-center mt-1">
                      <Badge variant="success" className="mr-2">
                        Online
                      </Badge>
                      <span className="text-sm text-gray-500">★ 4.9</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Response Time: &lt; 5 mins</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {tutorDetails.expertise?.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Video Call Usage</h4>
                  <Progress value={(callCount / MAX_FREE_CALLS) * 100} className="mb-2" />
                  <p className="text-sm text-gray-500">
                    {MAX_FREE_CALLS - callCount} free calls remaining
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <VideoCallSection tutorId={tutorId} courseId={courseId}  setParentCount={setCallCount}  />
            <ChatSection roomId={roomId}/>
          </div>
        </div>
      </div>
    </DotBackground>
  );
};

export default UserConnection;
