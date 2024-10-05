from rest_framework import status,generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, StudentListSerializer, CourseSerializer,CourseDetailSerializer, StudentCourseEnrollmentSerializer,CourseWatchSerializer
from .models import  OTPVerification, Student,User
import random
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework.status import HTTP_400_BAD_REQUEST
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime, timedelta
from rest_framework.permissions import IsAuthenticated, AllowAny
from tutor.models import Course
import stripe
from django.conf import settings
from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from lexi_admin.models import StudentCourseEnrollment
from django.conf import settings
stripe.api_key = settings.STRIPE_SECRET_KEY
import json


# from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
# from allauth.socialaccount.providers.oauth2.client import OAuth2Client
# from dj_rest_auth.registration.views import SocialLoginView

# class GoogleLogin(SocialLoginView):
#     adapter_class = GoogleOAuth2Adapter
#     callback_url = "http://localhost:8000/accounts/google/login/callback/"
#     client_class = OAuth2Client


# # Otp Creation
def generate_otp():
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])


def     send_otp_email(email, otp):
    subject = 'Verify you email'
    html_message = render_to_string('email_template.html', {'otp': otp})
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
    OTPVerification.objects.update_or_create(
        email=email,
        defaults={'otp': otp, 'created_at': timezone.now()}
    )
    if send_otp_email(email,otp):
        return {"message": "OTP sent to your email. Please verify."}
    else:
        return {"error":"Falid to send OTP"}
    

class SignUpView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            response = create_or_resend_otp(email)
            if 'error' in response:
                return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({
                'message': 'OTP sent successfully',
                'user_data': serializer.validated_data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



class VerifyEmailView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        user_data = request.data.get('user_data', {})

        if not email or not otp or not user_data:
            return Response({"error": "Email, OTP, and user data are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            verification = OTPVerification.objects.filter(email=email).latest('created_at')
        except OTPVerification.DoesNotExist:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        if verification.otp != otp:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        if verification.created_at < timezone.now() - timedelta(minutes=5):
            return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(data=user_data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                Student.objects.create(user=user)
                OTPVerification.objects.filter(email=email).delete()
                return Response({"message": "Email verified and user created successfully"}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class ResendOtpView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        response = create_or_resend_otp(email)
        if 'error' in response:
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(response, status=status.HTTP_200_OK)


class UserLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        # Authenticate user
       
        try:
            user = User.objects.get(email=email)
            if not user.is_active:
                return Response({'error': 'Your account has been blocked. Please contact support for assistance.'}, status=status.HTTP_403_FORBIDDEN)
            if user.check_password(password):
                print('password is checked')
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'message': 'Login successful'
                }, status=status.HTTP_200_OK)
            else:
             return Response({'error': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_401_UNAUTHORIZED)
        


# Forgot password
@method_decorator(csrf_exempt, name='dispatch')
class RequestotpView(View):
    def post(self, request):
        # Parse JSON data from request body
        data = json.loads(request.body)
        email = data.get('email')
        try:
            User.objects.get(email=email,user_type='student')
            otp = generate_otp()

            request.session['otp'] = otp
            request.session['otp_email'] = email

            if send_otp_email(email, otp):
                print('otp send successful')
                return JsonResponse({'message': 'OTP sent successfully!'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User with this email does not exist.'}, status=400)

@method_decorator(csrf_exempt, name='dispatch')    
class ForgotPassowrdVerifyOtpView(View):
    def post(self, request):
        body = json.loads(request.body)
        email = body.get('email')
        otp =  body.get('otp')
        new_password = body.get('newPassword')

        if str(request.session.get('otp')) == str(otp) and request.session.get('otp_email') == email:
            try:
                user = User.objects.get(email=email)
                user.set_password(new_password) 
                user.save() 
                del request.session['otp']
                del request.session['otp_email']
                return JsonResponse({'message': 'Password changed successfully!'}, status=200)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User with this email does not exist.'}, status=400)
        else:
            return JsonResponse({'error': 'Invalid OTP or email.'}, status=400)




# Refresh Token View
class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh = request.data.get('refresh')
        try:
            token  = RefreshToken(refresh)
            access_token = str(token.access_token)
            return Response({"access": access_token}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        


# Home page Latest Courses

# All Courses list
class CrouseListView(generics.ListAPIView):
    queryset = Course.objects.all().order_by('-created_at')
    serializer_class = CourseSerializer

#Course Details View
class CourseDetailView(generics.ListAPIView):
    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
            serializer = CourseDetailSerializer(course)
            return Response(serializer.data)
        except Course.DoesNotExist:
            return Response({'error':'Course not found'}, status=404)
    



#Enroll Course Video
class CourseVideoView(APIView):
    def get(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
            video_url = course.video_url
            return Response({"video_url": video_url}, status=status.HTTP_200_OK)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        




# Stripe Payment option for user
class CreateCheckoutSession(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            course_id = request.data.get('course_id')
            user = request.user  
            course = Course.objects.get(id=course_id)

            success_url = f"{settings.FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}"
            cancel_url = f"{settings.FRONTEND_URL}/cancel"

    

            # Create a Stripe checkout session
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'usd',
                            'unit_amount': int(course.price * 100),  # Stripe uses cents
                            'product_data': {
                                'name': course.title,
                            },
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=success_url,
                cancel_url=cancel_url,
            )

            StudentCourseEnrollment.objects.create(
                user=user,
                course=course,
                payment_status='completed',
                amount_paid=course.price
            )

            return Response({'id': checkout_session.id}, status=status.HTTP_201_CREATED)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print('bad request error', str(e))
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# User Enrolled Courses
class UserEnrolledCourses(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class =  StudentCourseEnrollmentSerializer

    def get_queryset(self):
        user = self.request.user
        return StudentCourseEnrollment.objects.filter(user=user).select_related('course').order_by('-created_at')
    

# User coruseWating



class WatchCourseView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, courseId):  
        user = request.user
        print(user)
        print(f"User: {user}, Course ID: {courseId}")
    
        try:
            # Check if the user is enrolled in the course and payment is completed
            enrollment = StudentCourseEnrollment.objects.get(user=user, id=courseId, payment_status='completed')
           
            
        except StudentCourseEnrollment.DoesNotExist:
            return Response({"error": "You are not enrolled in this course or payment is pending."}, status=status.HTTP_403_FORBIDDEN)
    
        try:
            # Fetch the course along with its lessons
            course = Course.objects.prefetch_related('lessons').get(id=24)
            serializer = CourseWatchSerializer(course)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

# Checking user is already enrolledCourse
class CheckEnrollmentView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, courseId):
        enrollment = StudentCourseEnrollment.objects.filter(user=request.user, course__id=courseId).first()
        if enrollment:
            return Response({'enrolled':True}, status=200)
        return Response({'enrolled':False}, status=200)




