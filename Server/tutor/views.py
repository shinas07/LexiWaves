from datetime import timedelta
from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse

# Create your views here.
from rest_framework import status, generics,viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import  TutorSerializer, TutorDetailsSerializer,CourseSerializer,LessonSerializer, CourseWithStudentsSerializer
import random
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import TutorOTPVerification,Tutor, Course, TutorDetails
from django.utils import timezone
from rest_framework.status import  HTTP_400_BAD_REQUEST
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import User
from django.contrib.auth.hashers import check_password
from rest_framework.permissions import IsAuthenticated
import boto3
from botocore.exceptions import ClientError
from django.conf import settings
import uuid
from lexi_admin.models import StudentCourseEnrollment


class TokenRefreshView(APIView):
    def post(self, request):
        refresh = request.data.get('refresh')
        try:
            refresh_token = RefreshToken(refresh)
            access = str(refresh_token.access_token)
            return Response({'access': access}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

def generate_otp():
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])


def send_otp_email(email, otp):

    subject = 'Verify you email'
    html_message = render_to_string('otp_temp.html', {'otp': otp})
    plain_message = strip_tags(html_message)
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]

    try:
        send_mail(subject,plain_message, from_email, recipient_list,  html_message=html_message, fail_silently=False)
        return True
    except Exception as e:
        return False
    

def create_or_resend_otp(email):
    otp = generate_otp()
    TutorOTPVerification.objects.update_or_create(
        email=email,
        defaults={'otp': otp, 'created_at': timezone.now()}
    )

    if send_otp_email(email,otp):
        return {"message": "OTP sent to your email. Please verify."}
    else:
        return {"error":"Falid to send OTP"}



class TutorSignUpView(APIView):
    def post(self, request):
        serializer = TutorSerializer(data=request.data)
  
        if serializer.is_valid():
            email = serializer.validated_data['email']

            # Generate or resend OTP
            response = create_or_resend_otp(email)
   
            if 'error' in response:
                
                return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({
                'message': 'OTP sent successfully',
                'user_data': serializer.validated_data
            }, status=status.HTTP_200_OK)
        
        # Return the serializer errors if validation failserrors = serializer.errors
        errors = serializer.errors
     
        if 'email' in errors:
            error_message = 'Email already registered.'
        elif 'password' in errors:
            error_message = 'Passwords do not match.'
        else:
            error_message = serializer.errors

        print(error_message)
        return Response({'error':error_message}, status=status.HTTP_400_BAD_REQUEST)
    

class TutorVerifyEmailView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        tutor_data = request.data.get('tutor_data', {})

        if not email or not otp:
            return Response({"error": "Email and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            verification = TutorOTPVerification.objects.filter(email=email, otp=otp).latest('created_at')
        except TutorOTPVerification.DoesNotExist:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        if verification.created_at < timezone.now() - timedelta(minutes=5):
            return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

        if not tutor_data:
            return Response({"error": "Tutor data not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            serializer = TutorSerializer(data=tutor_data)
            if serializer.is_valid():
                user = serializer.save()
                Tutor.objects.create(user=user)
                # Delete OTP verification after successful verification
                TutorOTPVerification.objects.filter(email=email).delete()
                return Response({"message": "Email verified and tutor created successfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(str(e))
            return Response({"error": 'server error, try again'}, status=status.HTTP_400_BAD_REQUEST)

class TutorResendOtpView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        response = create_or_resend_otp(email)
        if 'error' in response:
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(response, status=status.HTTP_200_OK)

class TutorLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:

            tutor_user = User.objects.get(email=email)
            

            if tutor_user.user_type == 'tutor' and check_password(password, tutor_user.password):
                refresh = RefreshToken.for_user(tutor_user)

                try:
                    tutor = Tutor.objects.get(user=tutor_user)
                    print("Fetched Tutor:", tutor)
                    
          
                    tutor_details = TutorDetails.objects.get(tutor_id=tutor.id)
               
                    print("Tutor Details:", tutor_details)
                    has_submitted_details = bool(tutor_details.phone_number)
                    print(has_submitted_details)

                except TutorDetails.DoesNotExist:
                    has_submitted_details = False

                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'message': 'Login successful',
                    'has_submitted_details': has_submitted_details
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid user type or password'}, status=status.HTTP_401_UNAUTHORIZED)

        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_401_UNAUTHORIZED)

 


class TutorDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print('tutor details',request.data)

        serializer = TutorDetailsSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            tutor_details = serializer.save()
            return Response({
                "message": "Details saved successfully!",
                "data": TutorDetailsSerializer(tutor_details).data
            }, status=status.HTTP_201_CREATED)
        else:
            print("Serializer errors:", serializer.errors)
            return Response({
                "error": "Failed to save details. Please try again.",
                "details": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
    




import json

class CourseCreationViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        print('POST Data:', request.POST)
        print('FILES:', request.FILES)

        # Extract course data
        course_data = {
            'title': request.data.get('title'),
            'description': request.data.get('description'),
            'category': request.data.get('category'),
            'price': request.data.get('price'),
            'duration': request.data.get('duration'),
            'difficulty': request.data.get('difficulty'),
        }

        # Upload thumbnail and preview video
        thumbnail = request.FILES.get('thumbnail')
        video_url = request.FILES.get('video_url')

        if not thumbnail or not video_url:
            return Response({'error': 'Both thumbnail and preview video are required.'}, status=status.HTTP_400_BAD_REQUEST)

        s3_client = boto3.client('s3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )

        try:
            # Upload thumbnail
            thumbnail_key = f'course_thumbnails/{uuid.uuid4()}-{thumbnail.name}'
            s3_client.upload_fileobj(thumbnail, settings.AWS_STORAGE_BUCKET_NAME, thumbnail_key)
            course_data['thumbnail_url'] = f'https://{settings.AWS_S3_CUSTOM_DOMAIN}/{thumbnail_key}'

            # Upload preview video
            preview_video_key = f'course_previews/{uuid.uuid4()}-{video_url.name}'
            s3_client.upload_fileobj(video_url, settings.AWS_STORAGE_BUCKET_NAME, preview_video_key)
            course_data['video_url'] = f'https://{settings.AWS_S3_CUSTOM_DOMAIN}/{preview_video_key}'

            print('Uploaded URLs:', course_data['thumbnail_url'], course_data['video_url'])

        except ClientError as e:
            print('S3 Upload Error:', str(e))
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Process lessons
        
        lessons_data = []
        lessons = request.data.get('lessons')
        if lessons:
            lessons = json.loads(lessons)
            for lesson in lessons:
                lesson_video = request.FILES.get(f'lesson_{lesson["order"]}_video')
                if lesson_video:
                    try:
                        lesson_video_key = f'lesson_videos/{uuid.uuid4()}-{lesson_video.name}'
                        s3_client.upload_fileobj(lesson_video, settings.AWS_STORAGE_BUCKET_NAME, lesson_video_key)
                        # Change this line
                        lesson['lesson_video_url'] = f'https://{settings.AWS_S3_CUSTOM_DOMAIN}/{lesson_video_key}'
                    except ClientError as e:
                        print(f'S3 Upload Error for lesson {lesson["order"]} video:', str(e))
                        return Response({'error': f'Error uploading video for lesson {lesson["order"]}'}, status=status.HTTP_400_BAD_REQUEST)
                lessons_data.append(lesson)
        # lesson_count = int(request.data.get('lesson_count', 0))
        # for i in range(lesson_count):
        #     lesson = {
        #         'title': request.data.get(f'lesson_{i}_title'),
        #         'description': request.data.get(f'lesson_{i}_description'),
        #         'order': i + 1
        #     }
        #     lesson_video = request.FILES.get(f'lesson_{i}_video')
        #     if lesson_video:
        #         try:
        #             lesson_video_key = f'lesson_videos/{uuid.uuid4()}-{lesson_video.name}'
        #             s3_client.upload_fileobj(lesson_video, settings.AWS_STORAGE_BUCKET_NAME, lesson_video_key)
        #             lesson['lesson_video_url'] = f'https://{settings.AWS_S3_CUSTOM_DOMAIN}/{lesson_video_key}'
        #         except ClientError as e:
        #             print(f'S3 Upload Error for lesson {i} video:', str(e))
        #             return Response({'error': f'Error uploading video for lesson {i+1}'}, status=status.HTTP_400_BAD_REQUEST)
        #     lessons_data.append(lesson)

        course_data['lessons'] = lessons_data

        serializer = CourseSerializer(data=course_data, context={'request': request})
        if not serializer.is_valid():
            print("Serializer validation failed:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class TutorCreatedCoursesView(generics.ListAPIView):

    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter courses by the logged-in tutor
        tutor = self.request.user  # Assuming the tutor is linked to the user
        return Course.objects.filter(tutor=tutor)

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            if not queryset.exists():
                return Response({"message": "You have not created any courses yet."}, status=status.HTTP_404_NOT_FOUND)
            
            # Serialize the queryset
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# Listing all Enrolled CourseList
class EnrolledCoursesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        tutor_courses = Course.objects.filter(tutor=user)
        enrollments = StudentCourseEnrollment.objects.filter(user=user, course__in=tutor_courses)
        
        courses = [enrollment.course for enrollment in enrollments]
        serializer = CourseWithStudentsSerializer(courses, many=True)
        return Response(serializer.data)