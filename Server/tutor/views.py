from datetime import timedelta
from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from django.db.models import Count
# Create your views here.
from rest_framework import status, generics,viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import  TutorSerializer, TutorDetailsSerializer,CourseSerializer,LessonSerializer, CourseWithStudentsSerializer,  QuestionSerializer, CourseDetailSerializer,TutorProfileSerializer,CourseUpdateSerializer,TutorCourseListSerializer
import random
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import TutorOTPVerification,Tutor, Course, TutorDetails, Question, Answer
from django.utils import timezone
from rest_framework.status import  HTTP_400_BAD_REQUEST
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import User
from django.contrib.auth.hashers import check_password
from rest_framework.permissions import IsAuthenticated
import boto3
from botocore.exceptions import ClientError
import uuid
from lexi_admin.models import StudentCourseEnrollment
import json
from .models import  LessonCompletion, Lesson,TutorSlot,TutorRevenue
from .serializers import CourseSerializer, LessonCompletionSerializer,TutorSlotSerializer
# from accounts.models import Student
from django.db.models import Sum,Q,FloatField, Case, When
from django.db.models.functions import TruncMonth
from datetime import datetime, timedelta

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

class TutorResendOtpView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error':'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        response = create_or_resend_otp(email)
        if 'error' in response:
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
        return Response(response, status=status.HTTP_200_OK)


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
            # Fetch the tutor user using the provided email
            tutor_user = User.objects.get(email=email)


            if tutor_user.user_type == 'tutor' and check_password(password, tutor_user.password):
                refresh = RefreshToken.for_user(tutor_user)

                try:
                    tutor = Tutor.objects.get(user=tutor_user)
                    tutor_details = TutorDetails.objects.get(tutor_id=tutor.id)
                    has_submitted_details = bool(tutor_details.phone_number)
                    admin_approved = tutor_details.admin_approved 

                except TutorDetails.DoesNotExist:
                    has_submitted_details = False
                    admin_approved = False

                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'message': 'Login successful',
                    'has_submitted_details': has_submitted_details,
                    'admin_approved': admin_approved,
                    'role':tutor_user.user_type,
                }, status=status.HTTP_200_OK)

            else:
                return Response({'error': 'Invalid user type or password'}, status=status.HTTP_403_FORBIDDEN)

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
class TutorDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        
        serializer = TutorDetailsSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            tutor_details = serializer.save()
            return Response({
                "message": "Details saved successfully!",
                "data": TutorDetailsSerializer(tutor_details).data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                "error": "Failed to save details. Please try again.",
                "details": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        

class TutorApprovalStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            tutor_details = TutorDetails.objects.get(tutor__user=request.user)
            data = {
                'is_approved': tutor_details.admin_approved,
                'status': 'approved' if tutor_details.admin_approved else 'pending',
                'submission_date': tutor_details.created_at,
            }
            return Response(data, status=status.HTTP_200_OK)

        except TutorDetails.DoesNotExist:
            return Response(
                {'error':'Tutor details not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error':str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )




class TutorDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            tutor = Tutor.objects.get(user=request.user)
        except Tutor.DoesNotExist:
            return Response(
                {"detail": "Tutor profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if TutorDetails exists
        if not TutorDetails.objects.filter(tutor=tutor).exists():
            return Response(
                {"detail": "Tutor details missing. Complete your profile."},
                status=status.HTTP_200_OK # Redirect status for missing tutor details
            )

        tutor_details = TutorDetails.objects.get(tutor=tutor)

        # Check if tutor is admin-approved
        if not tutor_details.admin_approved:
            return Response(
                {"detail": "Access denied. Admin approval required."},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response({"message": "Access granted to dashboard."}, status=status.HTTP_200_OK)

# Tutor Profile View
class TutorProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            tutor = Tutor.objects.select_related('user').get(user=request.user)
            course_count = Course.objects.filter(tutor=tutor.user,is_approved=True).count()
            student_count = StudentCourseEnrollment.objects.filter(course__tutor=tutor.user,payment_status='completed').values('user').distinct().count()
            serializer = TutorProfileSerializer(tutor)
            data = serializer.data
            data.update({
                'total_courses':course_count,
                'student_count':student_count,
            })
            return Response(data)
        except Tutor.DoesNotExist as e:
            return Response({"error": "Tutor profile not found"}, status=404)

class CourseCreationViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        course_data = {
            'title': request.data.get('title'),
            'description': request.data.get('description'),
            'category': request.data.get('category'),
            'price': request.data.get('price'),
            'duration': request.data.get('duration'),
            'difficulty': request.data.get('difficulty'),
        }

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

            thumbnail_key = f'course_thumbnails/{uuid.uuid4()}-{thumbnail.name}'
            s3_client.upload_fileobj(thumbnail, settings.AWS_STORAGE_BUCKET_NAME, thumbnail_key)
            course_data['thumbnail_url'] = f'https://{settings.AWS_S3_CUSTOM_DOMAIN}/{thumbnail_key}'

            # Upload preview video
            preview_video_key = f'course_previews/{uuid.uuid4()}-{video_url.name}'
            s3_client.upload_fileobj(video_url, settings.AWS_STORAGE_BUCKET_NAME, preview_video_key)
            course_data['video_url'] = f'https://{settings.AWS_S3_CUSTOM_DOMAIN}/{preview_video_key}'

            # Process lessons
            lessons_data = []
            lesson_count = int(request.data.get('lesson_count', 0))
            for i in range(1, lesson_count + 1):
                lesson = {
                    'title': request.data.get(f'lesson_{i}_title'),
                    'description': request.data.get(f'lesson_{i}_description'),
                    'order': request.data.get(f'lesson_{i}_order'),
                }
                lesson_video = request.FILES.get(f'lesson_{i}_video')
                if lesson_video:
                    lesson_video_key = f'lesson_videos/{uuid.uuid4()}-{lesson_video.name}'
                    s3_client.upload_fileobj(lesson_video, settings.AWS_STORAGE_BUCKET_NAME, lesson_video_key)
                    lesson['lesson_video_url'] = f'https://{settings.AWS_S3_CUSTOM_DOMAIN}/{lesson_video_key}'
                lessons_data.append(lesson)

            course_data['lessons'] = lessons_data

            serializer = CourseSerializer(data=course_data, context={'request': request})
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            course = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ClientError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)




class TutorCreatedCoursesView(generics.ListAPIView):
    serializer_class = TutorCourseListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        tutor = self.request.user
        return Course.objects.filter(tutor=tutor)\
            .annotate(
                students_count=Count(
                    'studentcourseenrollment',
                    filter=Q(studentcourseenrollment__payment_status='completed')
                )
            )\
            .order_by('-created_at')
        

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
    



class CompleteLessonView(generics.CreateAPIView):
    serializer_class = LessonCompletionSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        lesson_id = request.data.get('lesson_id')
       
        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)

        completion, created = LessonCompletion.objects.get_or_create(
            user=request.user,
            lesson=lesson
        )

        serializer = self.get_serializer(completion)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class CompletedLessonsView(generics.ListAPIView):
    serializer_class = LessonCompletionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return LessonCompletion.objects.filter(
            user=self.request.user,
            lesson__course_id=course_id
        )



# Quiz Functions
class QuizCreationView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer

    def get(self, request, courseId):
        """Fetch quiz questions for a course"""
        course = get_object_or_404(Course, id=courseId, tutor=request.user)
        questions = Question.objects.filter(course=course)
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        courseId = self.kwargs.get('courseId')  # Get courseId from URL parameters
        questions_data = request.data.get('questions', [])
    

        try:
            course = Course.objects.get(id=courseId, tutor=request.user)
        except Course.DoesNotExist:
            return Response({"error": "Course not found or you don't have permission."}, status=status.HTTP_404_NOT_FOUND)

        created_questions = []

        for question_data in questions_data:
            question_text = question_data.get('text')
            answers_data = question_data.get('answers', [])

            question = Question.objects.create(course=course, text=question_text)

            for answer_data in answers_data:
                Answer.objects.create(
                    question=question,
                    text=answer_data['text'],
                    is_correct=answer_data['is_correct']
                )

            created_questions.append(question)

        serializer = self.get_serializer(created_questions, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
# Crouse edit
class CourseDetailView(generics.RetrieveUpdateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseUpdateSerializer

    def get(self, request, *args, **kwargs):
        course_id = kwargs.get('courseId') 
        try:
            course = self.get_object()  
            serializer = self.get_serializer(course)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        course_id = kwargs.get('pk')
        course = self.get_object()  
        serializer = self.get_serializer(course, data=request.data)

        if serializer.is_valid():
            serializer.save()  # Save the updated course details
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Course all detials includeing Quiz
class CourseAllDetails(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer

    def get(self, request, *args, **kwargs):
        course_id = kwargs.get('pk')
        try:
            course = self.get_object()
            serializer = self.get_serializer(course)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Course.DoesNotExist:
            return Response({'error':'Course not found'}, status=status.HTTP_400_BAD_REQUEST)
    
    
class TutorLogoutView(APIView):
    permission_class = [IsAuthenticated]
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')

            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"success": "User logged out successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# views.py

class RevenueReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        tutor = request.user  # Get the logged-in tutor

        # Get all courses taught by the tutor
        courses = Course.objects.filter(tutor=tutor)

        revenue_data = []

        for course in courses:
            # Aggregate the total revenue from enrolled students
            total_revenue = StudentCourseEnrollment.objects.filter(course=course).aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0

            # Get the number of students enrolled in the course
            students_enrolled = StudentCourseEnrollment.objects.filter(course=course).count()

            revenue_data.append({
                "course_title": course.title,
                "students_enrolled": students_enrolled,
                "total_revenue": total_revenue,
                "course_price": course.price,  # Assuming each course has a price field
            })

        return Response({"revenue_report": revenue_data})

class TutorSlotView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tutor = Tutor.objects.get(user=request.user)
        slots = TutorSlot.objects.filter(tutor=tutor)
        serializer = TutorSlotSerializer(slots)
        return Response(serializer.data)

    def post(self, request):
        serializer = TutorSlotSerializer(data=request.data)
        if serializer.is_valid():
            tutor = Tutor.objects.get(user=request.user)
            serializer.save(tutor=tutor)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Dashboard Revenue details
class TutorDashboardDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            tutor = request.user
            # Calculate total revenue
            total_revenue = TutorRevenue.objects.filter(
                tutor=tutor
            ).aggregate(
                total=Sum('amount')
            )['total'] or 0

            # Calculate current month's earnings using timezone-aware dates
            now = timezone.now()
            month_start = timezone.make_aware(
                datetime(now.year, now.month, 1)
            )
            monthly_earnings = TutorRevenue.objects.filter(
                tutor=tutor,
                created_at__gte=month_start,
                created_at__lte=now
            ).aggregate(
                total=Sum('amount')
            )['total'] or 0

            active_courses = Course.objects.filter(tutor=tutor, is_approved=True).count()

            # For the six months calculation
            six_months_ago = now - timezone.timedelta(days=180)

            monthly_revenue = TutorRevenue.objects.filter(
                tutor=tutor,
                created_at__gte=six_months_ago
            ).annotate(
                month=TruncMonth('created_at')
            ).values('month').annotate(
                total=Sum('amount')
            ).order_by('month')

            # Prepare chart data
            revenue_labels = []
            revenue_data = []
            
            for entry in monthly_revenue:
                revenue_labels.append(entry['month'].strftime('%B %Y'))
                revenue_data.append(float(entry['total']))

            return Response({
                'status': 'success',
                'total_revenue': float(total_revenue),
                'revenue_labels': revenue_labels,
                'revenue_data': revenue_data,
                'active_courses_count': active_courses,
                'monthly_earnings': float(monthly_earnings)
            })

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=500)



# Revenue OverView
class TutorRevenueDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            tutor = request.user
            today = timezone.now()
            current_month_start = today.replace(day=1, hour=0, minute=0, second=0)

            # Calculate total revenue
            total_revenue = TutorRevenue.objects.filter(
                tutor=tutor,
            ).aggregate(
                total=Sum('amount') 
            )['total'] or 0
            
            # Calculate monthly revenue
            monthly_revenue = TutorRevenue.objects.filter(
                tutor=tutor,
                created_at__gte=current_month_start
            ).aggregate(
                total=Sum('amount') 
            )['total'] or 0  

            # Get course revenues and admin commissions
            course_revenues = Course.objects.filter(
                tutor=tutor
            ).annotate(
                total_revenue=Sum('tutorrevenue__amount'),
                # Use Case and When to handle admin commission calculation
                admin_commission=Sum(
                    Case(
                        When(adminrevenue__amount__isnull=False, then='adminrevenue__amount'),
                        default=0,
                        output_field=FloatField()
                    )
                ),
                enrollment_count=Count('studentcourseenrollment', 
                    filter=Q(studentcourseenrollment__payment_status='completed')
                )
            ).values(
                'id', 
                'title', 
                'total_revenue',
                'admin_commission',  # Include admin commission in the response
                'enrollment_count',
                'price'
            )
            
            recent_transactions = TutorRevenue.objects.filter(
                tutor=tutor
            ).select_related('course').order_by(
                '-created_at'
            )[:10]

            return Response({
                'summary': {
                    'total_revenue': float(total_revenue),
                    'monthly_revenue': float(monthly_revenue),
                    'total_courses': Course.objects.filter(tutor=tutor).count(),
                    'total_enrollments': sum(c['enrollment_count'] for c in course_revenues)
                },
                'courses': [{
                    'id': course['id'],
                    'title': course['title'],
                    'revenue': float(course['total_revenue'] or 0),
                    'admin_commission': float(course['admin_commission'] or 0),  # Pass the admin commission
                    'enrollments': course['enrollment_count'],
                    'price': float(course['price'])
                } for course in course_revenues],
                'recent_transactions': [{
                    'id': tx.id,
                    'course_title': tx.course.title,
                    'amount': float(tx.amount),
                    'date': tx.created_at.strftime('%Y-%m-%d %H:%M'),
                } for tx in recent_transactions]
            })

        except Exception as e:
            return Response(
                {'error': 'Failed to fetch revenue details'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
