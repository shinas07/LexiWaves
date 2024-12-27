from rest_framework import status,generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, StudentListSerializer, CourseSerializer,CourseDetailSerializer, StudentCourseEnrollmentSerializer,CourseWatchSerializer, UserProfileImageSerializer, UserProfileSerializer
from .models import  OTPVerification, Student,User
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime, timedelta
from rest_framework.permissions import IsAuthenticated, AllowAny
from tutor.models import QuizAttempt, Lesson
from tutor.models import Course
import stripe
from django.conf import settings
from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from lexi_admin.models import StudentCourseEnrollment
from lexi_admin.models import AdminRevenue
from tutor.models import TutorRevenue
from django.conf import settings
stripe.api_key = settings.STRIPE_SECRET_KEY
import json
import uuid
import boto3
import random
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from google.oauth2 import id_token
from google.auth.transport import requests


class GoogleSignInView(APIView):
    def post(self, request):
        try:
            token = request.data.get('token')
            if not token:
                return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Verify the token
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_OAUTH2_CLIENT_ID
            )
            
            # Extract user information
            email = idinfo.get('email')
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            google_id = idinfo.get('sub')
            if not email:
                return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            
            # Create or get the user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'goggle_id': google_id,
                    'first_name': first_name,
                    'last_name': last_name,
                    'user_type': 'student',  
                    'is_active': True
                }
            )


            if user.user_type != 'student':
                return Response({'error':'Access deined, This login is only for Students'},status=status.HTTP_403_FORBIDDEN)

            if not created and not user.google_id:
                user.google_id = google_id
                user.save()
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'email': user.email,
                    'user_type': user.user_type,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            }, status=status.HTTP_200_OK)
            
        except ValueError as e:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def generate_token(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }

# # Otp Creation
def generate_otp():
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])


def send_otp_email(email, otp):
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

        try:
            user = User.objects.get(email=email)
            if user.user_type != 'student':
                return Response({'error':'Access denied. This login is only for students.'},status=status.HTTP_403_FORBIDDEN)
            if not user.is_active:
                return Response({'error': 'Your account has been blocked. Please contact support for assistance.'}, status=status.HTTP_403_FORBIDDEN)
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'message': 'Login successful',
                    'user':{
                        'email':user.email,
                        'user_type':user.user_type,
                    }
                }, status=status.HTTP_200_OK)
            else:
             return Response({'error': 'Invalid password'}, status=status.HTTP_403_FORBIDDEN)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_403_FORBIDDEN)
        


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
        
# User Profile View
class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get(self, request):
        user = request.user
        serializer = self.serializer_class(user)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, *args, **kwargs):
        user = request.user
        serializer = self.serializer_class(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
# Password Change
class ChangePasswordView(APIView):
    permission_class = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not user.check_password(current_password):
            return Response({"error":"Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)
    
        if user.check_password(new_password):
            return Response({"error":"New password cannot be the same as the current password."},status=status.HTTP_400_BAD_REQUEST)
      
        user.set_password(new_password)
        user.save()
        return Response({"successful":"password changed succeefully."},status=status.HTTP_200_OK)
    
# User Profile Upload



class UserProfileImageUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        
        # Get the uploaded profile image from the request
        profile_image = request.FILES.get('profile_image')
        
        if not profile_image:
            return Response({'error': 'Profile image is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Initialize the S3 client
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )

        try:
            # Create a unique file name for the image
            image_key = f'profile_images/{uuid.uuid4()}-{profile_image.name}'
            # Upload the file to S3
            s3_client.upload_fileobj(profile_image, settings.AWS_STORAGE_BUCKET_NAME, image_key, ExtraArgs={'ACL': 'public-read'})

            # Construct the full URL to the image
            profile_image_url = f'https://{settings.AWS_S3_CUSTOM_DOMAIN}/{image_key}'
            
            # Prepare the data for the serializer
            serializer = UserProfileImageSerializer(user, data={'profile_image': profile_image_url}, partial=True) 
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserProfileImageRemoveView(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user  # Assuming the user is authenticated
        
        # Check if the user has a profile image
        if user.profile_image:
            # Extract the image key from the URL
            image_key = user.profile_image.split('/')[-1]  # Assuming the URL structure is consistent
            
            # Initialize the S3 client
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME
            )
            
            # Delete the image from S3
            user.profile_image = None
            user.save()
            try:
                s3_client.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=f'profile_images/{image_key}')
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Remove the profile image from the user model
            user.profile_image = None  # Remove the profile image
            user.save()  # Save the changes
            
            return Response({"message": "Profile image removed successfully"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "No profile image to remove."}, status=status.HTTP_400_BAD_REQUEST)


# Home page Latest Courses

# All Courses list
class CourseListView(generics.ListAPIView):
    queryset = Course.objects.filter(is_approved=True).order_by('-created_at')
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

            # Add metadata to track the payment
            metadata = {
                'course_id': str(course_id),
                'user_id': str(user.id),
                'course_price': str(course.price)
            }

            success_url = f"{settings.FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}"
            cancel_url = f"{settings.FRONTEND_URL}/cancel?session_id={{CHECKOUT_SESSION_ID}}"

            # Create Stripe checkout session with metadata
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'usd',
                        'unit_amount': int(course.price * 100),
                        'product_data': {
                            'name': course.title,
                            'description': course.description[:300],
                        },
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=success_url,
                cancel_url=cancel_url,
                metadata=metadata
            )


            return Response({'id': checkout_session.id}, status=status.HTTP_201_CREATED)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@require_POST
def stripe_webhook(request):
    payload = request.body.decode('utf-8')
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        # Construct the event
        event = stripe.Webhook.construct_event(
            payload.encode('utf-8'),  # Encode back to bytes
            sig_header,
            settings.STRIPE_WEBHOOK_SECRET
        )
        
        # Handle the checkout.session.completed event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            
            # Get data from session
            course_id = session['metadata']['course_id']
            user_id = session['metadata']['user_id']
            amount = float(session['metadata']['course_price'])
            
      
            
            try:
                # Your existing processing code...
                course = Course.objects.get(id=course_id)
                user = User.objects.get(id=user_id)
                
                # Calculate shares correctly
                admin_share = amount * 0.20  # 10% of amount
                tutor_share = amount - admin_share

                enrollment = StudentCourseEnrollment.objects.create(
                    user=user,
                    course=course,
                    payment_status='completed',
                    amount_paid=amount,
                    session_id=session['id']
                )
                
                # Create revenue records
                AdminRevenue.objects.create(
                    course=course,
                    amount=admin_share,
                    payment_id=session['id']
                )
                
                TutorRevenue.objects.create(
                    course=course,
                    tutor=course.tutor,
                    amount=tutor_share,
                    payment_id=session['id']
                )
                
                # Create enrollment and revenue records...
                
                return HttpResponse(status=200)
                
            except Exception as e:
                return HttpResponse(status=500)
                
    except ValueError as e:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)
    except Exception as e:
        return HttpResponse(status=400)

    return HttpResponse(status=200)

# User Enrolled Courses
class UserEnrolledCourses(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class =  StudentCourseEnrollmentSerializer

    def get_queryset(self):
        user = self.request.user
        return StudentCourseEnrollment.objects.filter(user=user).select_related('course').order_by('-created_at')

class WatchCourseView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, courseId):  
        user = request.user
      
    
        try:
            # Check if the user is enrolled in the course and payment is completed
            enrollment = StudentCourseEnrollment.objects.get(user=user, id=courseId, payment_status='completed')
           
            
        except StudentCourseEnrollment.DoesNotExist:
            return Response({"error": "You are not enrolled in this course or payment is pending."}, status=status.HTTP_403_FORBIDDEN)
    
        try:
            course = enrollment.course 
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
            return Response({'enrolled':True, 'enrollment_id': enrollment.id}, status=200)
        return Response({'enrolled':False}, status=200)


# UserLogOut
class LogoutView(APIView):

    def post(self, request):
        try:
            # Get the refresh token from the request data
            refresh_token = request.data.get('refresh_token')
         
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({"success": "User logged out successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
         
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
      


class DeactivateAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'success': False, 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not user.check_password(password):
            return Response({'success': False, 'message': 'Invalid password.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Deleting quiz attempts
        QuizAttempt.objects.filter(user=user).delete()

        # Since 'Lesson' is connected via 'Course' (through the tutor), filter by course__tutor
        lessons = Lesson.objects.filter(course__tutor=user)
        lessons.delete()

        # # For tutors, delete associated courses, questions, answers, and tutor details
        # if user.user_type == 'tutor':
        #     courses = Course.objects.filter(tutor=user)
        #     for course in courses:
        #         Question.objects.filter(course=course).delete()
        #         Answer.objects.filter(question__course=course).delete()
        #         Lesson.objects.filter(course=course).delete()
        #     courses.delete()

        #     # Delete TutorDetails for the tutor
        #     TutorDetails.objects.filter(tutor=user).delete()

        # Finally, delete the user account
        user.delete()

        return Response({'success': True, 'message': 'Account successfully deactivated.'}, status=status.HTTP_200_OK)
