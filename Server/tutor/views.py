from datetime import timedelta
from django.shortcuts import get_object_or_404, render

# Create your views here.
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import  TutorSerializer, TutorDetailsSerializer
import random
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import TutorOTPVerification,Tutor
from django.utils import timezone
from rest_framework.status import  HTTP_400_BAD_REQUEST
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import User
from django.contrib.auth.hashers import check_password
from rest_framework.permissions import IsAuthenticated



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
        print(request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']

            # Generate or resend OTP
            response = create_or_resend_otp(email)
            print(response)
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
        print('haai', email,password)

        try:
            # Manually fetch the user based on email
            tutor = User.objects.get(email=email)
         

            if tutor.user_type == 'tutor' and check_password(password, tutor.password):
                refresh = RefreshToken.for_user(tutor)
                
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'message': 'Login successful'
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid user type or password'}, status=status.HTTP_401_UNAUTHORIZED)

        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_401_UNAUTHORIZED)



class TutorDetails(APIView):
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
            print("Serializer errors:", serializer.errors)
            return Response({
                "error": "Failed to save details. Please try again.",
                "details": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
    
