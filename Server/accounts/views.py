from rest_framework import status,generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, StudentListSerializer
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
from rest_framework.permissions import IsAuthenticated




from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

class GoogleLogin(SocialLoginView): # if you want to use Authorization Code Grant, use this
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http:/localhost:5173"
    client_class = OAuth2Client


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
    print('otp', otp)
    if send_otp_email(email,otp):
        return {"message": "OTP sent to your email. Please verify."}
    else:
        return {"error":"Falid to send OTP"}
    

class SignUpView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            response = create_or_resend_otp(email)
            if 'error' in response:
                return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({
                'message': 'OTP sent successfully',
                'user_data': serializer.validated_data
            }, status=status.HTTP_200_OK)
        print(serializer.errors)
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


    


    






# # Admin Student List
# class StudentListView(generics.ListAPIView):
#     queryset = StudentUser.objects.all()
#     serializer_class = StudentListSerializer





