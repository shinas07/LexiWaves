from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import VideoCallRequest
from .serializers import VideoCallRequestSerializer
from rest_framework.permissions import IsAuthenticated
from accounts.models import Student
from tutor.models import Tutor
from lexi_admin.models import Course
from accounts.models import User
from rest_framework.decorators import api_view, permission_classes
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from datetime import timedelta,datetime
from .task import send_video_call_emails
from decouple import config
from agora_token_builder import RtcTokenBuilder
from django.utils import timezone



import time
class UserVideoCallRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        student = request.user
        tutor_id = request.data.get('tutorId')
        course_id = request.data.get('courseId')

        try:
            tutor = User.objects.get(id=tutor_id)
            course = Course.objects.get(id=course_id)

            active_request = VideoCallRequest.objects.filter(student=student,tutor=tutor,course=course,
                                                             status__in=['pending','accepted']).first()
            
            if(active_request):
                return Response({
                    'details':'You already have an active request for this course.',
                    "request_status":active_request.status,
                    "created_at":active_request.created_at,
                },status=status.HTTP_400_BAD_REQUEST)
            
            

            
            request_count = VideoCallRequest.objects.filter(
                student=student,
                tutor=tutor,
                course=course
            ).count()

            if request_count >= 3:
                return Response(
                    {"detail": "You can only request a video call 3 times for this tutor and course."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            video_call_request = VideoCallRequest.objects.create(
                student=student,
                tutor=tutor,
                course=course,
                status='pending'  
            )

            serializer = VideoCallRequestSerializer(video_call_request)
            return Response({
                "message": "Video call request sent successfully.",
                "request": serializer.data
            }, status=status.HTTP_201_CREATED)

        except Tutor.DoesNotExist:
            return Response(
                {"detail": "Tutor not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Course.DoesNotExist:
            return Response(
                {"detail": "Course not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class CheckVideoRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tutor_id = request.query_params.get('tutorId')
        course_id = request.query_params.get('courseId')

        try:
            count = VideoCallRequest.objects.filter(
                student=request.user,
                tutor_id=tutor_id,
                course_id=course_id
            ).count()
            # Get the most recent request
            request = VideoCallRequest.objects.filter(
                student=request.user,
                tutor_id=tutor_id,
                course_id=course_id
            ).latest('created_at')

            serializer = VideoCallRequestSerializer(request)
            return Response({
                'request': serializer.data,
                'count':count

            },status=status.HTTP_200_OK)
        except VideoCallRequest.DoesNotExist as e:
            return Response({
                'request': None,
                'count':0
            }, status=status.HTTP_204_NO_CONTENT)

# Tutor Side
class StudentVideoRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id):
        try:
            
            student = User.objects.get(id=student_id)
            requests = VideoCallRequest.objects.filter(student=student,tutor=request.user).order_by('-created_at')
            serializer = VideoCallRequestSerializer(requests, many=True)
            
            return Response({'requests': serializer.data}, status=status.HTTP_200_OK)

        except User.DoesNotExist:

            return Response({'error': 'Student not found'},status=status.HTTP_404_NOT_FOUND)

class VideoCallRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id):
        try:
            student = User.objects.get(id=student_id)
            course_id = request.query_params.get('course')


            # Filter by course if provided
            requests = VideoCallRequest.objects.filter(
                student=student,
                tutor=request.user
            )
            
            if course_id:
                requests = requests.filter(course=course_id)
                
            requests = requests.order_by('-created_at')
            serializer = VideoCallRequestSerializer(requests, many=True)
            
            return Response({'requests': serializer.data}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)



# Video call time Schedul
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def handle_video_call_request(request, request_id):
    try:
        video_request = VideoCallRequest.objects.get(id=request_id)
        action = request.data.get('action')
        if action == 'accept':
            scheduled_time = request.data.get('scheduled_time')
            if not scheduled_time:
                return Response(
                    {'error': 'Scheduled time is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            scheduled_time = datetime.fromisoformat(request.data.get('scheduled_time').replace('Z', '+00:00'))

            # Update request status and time
            video_request.status = 'accepted'
            video_request.scheduled_time = scheduled_time
            video_request.save()
         
            # Queue email sending task
            send_video_call_emails.delay(video_request.id)

            return Response({
                'message': 'Video call scheduled successfully',
                'scheduled_time': scheduled_time
            },status=status.HTTP_200_OK)

        elif action == 'decline':
            video_request.status = 'declined'
            video_request.save()

         
            
            return Response({'message': 'Request declined successfully'})

        return Response(
            {'error': 'Invalid action'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    except VideoCallRequest.DoesNotExist:
        return Response(
            {'error': 'Request not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class AgoraVideoCallTokenView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, request_id):
        try:
            
            video_request = VideoCallRequest.objects.get(id=request_id)

            
            if request.user not in [video_request.student, video_request.tutor]:
                return Response(
                    {'error': 'Not authorized for this video call'},
                    status=status.HTTP_403_FORBIDDEN
                )

            if video_request.status != 'accepted':
                return Response(
                    {'error': 'Call must be accepted before joining'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Generate token
            app_id = config('AGORA_APP_ID')
            app_certificate = config('AGORA_APP_CERTIFICATE')
            channel_name = f"call_{video_request.id}"
            
            expiration_time_in_seconds = 3600
            current_timestamp = int(time.time())
            privilegeExpiredTs = current_timestamp + expiration_time_in_seconds

            token = RtcTokenBuilder.buildTokenWithUid(
                appId=app_id,
                appCertificate=app_certificate,
                channelName=channel_name,
                uid=0,
                role=1,
                privilegeExpiredTs=privilegeExpiredTs
            )
            return Response({
                "token": token,
                "channelName": channel_name,
                "uid": 0,
                "studentInfo": {
                    "name": video_request.student.get_full_name() if request.user == video_request.tutor else video_request.tutor.get_full_name()
                }
            })

        except VideoCallRequest.DoesNotExist:
            return Response(
                {"error": "Video call request not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
                
class EndVideoCallView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, request_id):
        try:
            video_request = VideoCallRequest.objects.get(id=request_id)
            
            if request.user not in [video_request.tutor, video_request.student]:
                return Response(
                    {'error': 'Not authorized to end this call'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Check if call is already completed
            if video_request.status == 'completed':
                return Response(
                    {'error': 'Call is already completed'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update the video call request
            video_request.status = 'completed'
            video_request.completed_at = timezone.now()
            video_request.ended_by = request.user
            video_request.save()
            
            return Response({
                'message': 'Call ended successfully',
                'completed_at': video_request.completed_at,
                'status': 'completed'
            }, status=status.HTTP_200_OK)
            
        except VideoCallRequest.DoesNotExist:
            return Response(
                {'error': 'Video call request not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class MarkVideoCallExpiredView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, request_id):
        try:
            video_request = VideoCallRequest.objects.get(id=request_id)
            if request.user not in [video_request.student, video_request.tutor]:
                return Response({'error':'Not authorized'},
                                status=status.HTTP_403_FORBIDDEN)

            video_request.status = 'expired'
            video_request.save()

            return Response({'status':'expired'})
        except VideoCallRequest.DoesNotExist:
            return Response(
                {'error':'Video call request not found'},
                status=status.HTTP_404_NOT_FOUND
            )