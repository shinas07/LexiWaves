import React, { useState, useEffect } from 'react';
import { DotBackground } from '../../../components/Background';
import VideoCallSection from './VideoCallMange';
import api from '../../../service/api';
import { useLocation } from 'react-router-dom';
import Loader from '../../Loader';
import ChatSection from './Chat';
import FloatingNavbar from '../../../components/Navbar';
import { toast } from 'sonner';
const UserConnection = () => {
 const [tutorDetails, setTutorDetails] = useState(null);
 const [roomId, setRoomId] = useState(null);
 const [roomName, setRoomName] = useState("");
 const [roomExists, setRoomExists] = useState(false);
 const location = useLocation();
 const tutorId = location.state?.tutorId;
 const courseId = location.state?.courseId;
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
       toast.error("Error checking or creating room");
     }
   };
    if (tutorId) {
     checkOrCreateRoom();
   }
 }, [tutorId, courseId]);
  if (!tutorDetails) {
   return (
     <DotBackground>
       <div><Loader/></div>
     </DotBackground>
   );
 }
  return (
   <DotBackground>
     <FloatingNavbar/>
     <div className="min-h-screen py-20 mt-4 px-4 lg:px-8">
       <div className="max-w-7xl mx-auto">
         {/* Header */}
         <div className="mb-8">
           <h1 className="text-2xl font-bold text-white mb-2">
             Interactive Session
           </h1>
           <p className="text-gray-400">
             Connect with your tutor through video calls and chat
           </p>
         </div>
          {/* Main Content Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Video Call Section */}
           <div className="w-full h-full">
             <VideoCallSection 
               tutorId={tutorId} 
               courseId={courseId} 
             />
           </div>
            {/* Chat Section */}
           <div className="w-full h-full">
             <ChatSection roomId={roomId} />
           </div>
         </div>
       </div>
     </div>
   </DotBackground>
 );
};
export default UserConnection;