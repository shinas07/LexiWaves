from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from .models import ClassChatRoom
from accounts.models import User
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from rest_framework.views import APIView
from lexi_admin.models import StudentCourseEnrollment
from django.db.models import Count, Q, Max, OuterRef, Subquery
from .serializers import TutorStudentListSerializer,ChatMessageSerializer,ChatRoomDetailSerializer
from .models import ClassChatRoom, ClassChatMessage
import uuid
from django.shortcuts import get_object_or_404
from video_call.models import VideoCallRequest  # Import your video call model


class CheckOrCreateRoomView(APIView):
    # authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, tutor_id,course_id):
        user = request.user
        room, created = ClassChatRoom.objects.get_or_create(tutor_id=tutor_id,course_id=course_id,user=user)

        return JsonResponse({
            "exists": not created,
            "room_id": str(room.room_id)  
        })
    
# User list for tutor side 
class TutorStudentsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
           
            enrolled_students = StudentCourseEnrollment.objects.filter(
                course__tutor=request.user,
                payment_status='completed',
                user__user_type='student'
            ).select_related(
                'user',
            ).distinct('user__id')

            serializer = TutorStudentListSerializer(enrolled_students,many=True)
    
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
           
            return Response({'error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# User CourseChatBox in tutor side
class AllCourseChatBoxesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id):
        try:
            # Get latest video request time for each course
            latest_requests = VideoCallRequest.objects.filter(
                course=OuterRef('course'),
                student_id=student_id
            ).values('course').annotate(
                latest_request=Max('created_at')
            ).values('latest_request')

            # Get enrollments with latest request time
            enrollments = StudentCourseEnrollment.objects.filter(
                user_id=student_id,
                course__tutor=request.user,
                payment_status='completed'
            ).select_related('user', 'course').annotate(
                latest_request_time=Subquery(latest_requests)
            ).order_by('-latest_request_time', '-created_at')  

            if not enrollments.exists():
                return Response(
                    {'error': 'Student not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            first_enrollment = enrollments.first()
            
            courses_data = []
            for enrollment in enrollments:
                chat_room, created = ClassChatRoom.objects.get_or_create(
                    tutor=request.user,
                    user_id=student_id,
                    course=enrollment.course,
                    defaults={'room_id': uuid.uuid4()}
                )
                
                courses_data.append({
                    'id': enrollment.course.id,
                    'course_name': enrollment.course.title,
                    'room_id': chat_room.room_id,
                    'created_at': enrollment.created_at,
                    'latest_request_time': enrollment.latest_request_time
                })

            response_data = {
                'student': {
                    'id': first_enrollment.user.id,
                    'name': first_enrollment.user.first_name,
                    'email': first_enrollment.user.email
                },
                'courses': courses_data
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': 'Failed to fetch chat boxes'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Tutor Messaging View
# class TutorChatMessageView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, room_id):
#         try:
#             # Verify and get chat room
#             chat_room = get_object_or_404(
#                 ClassChatRoom.objects.prefetch_related('messages'), 
#                 room_id=room_id,
#                 tutor=request.user
#             )

#             serializer = ChatRoomDetailSerializer(chat_room)
#             return Response(serializer.data, status=status.HTTP_200_OK)

#         except Exception as e:
#             print(f"Error: {str(e)}")
#             return Response(
#                 {'error': 'Failed to fetch messages'}, 
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )

#     def post(self, request, room_id):
#         try:
#             # Verify chat room
#             chat_room = get_object_or_404(
#                 ClassChatRoom, 
#                 room_id=room_id,
#                 tutor=request.user
#             )

#             message_data = {
#                 'room': chat_room,
#                 'user': request.user,
#                 'content': request.data.get('message', '').strip()
#             }

#             serializer = ChatMessageSerializer(data=message_data)
#             serializer.is_valid(raise_exception=True)
#             message = serializer.save()

#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         except serializer.ValidationError as e:
#             return Response(
#                 {'error': 'Invalid message data', 'details': e.detail}, 
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#         except Exception as e:
#             print(f"Error: {str(e)}")
#             return Response(
#                 {'error': 'Failed to send message'}, 
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )

# Calculating studey streak 


