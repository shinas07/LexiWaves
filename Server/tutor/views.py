from datetime import timedelta
from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import TutorSerializer
import random
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import TutorOTPVerification,Tutor
from django.utils import timezone
from rest_framework.status import  HTTP_400_BAD_REQUEST
from rest_framework_simplejwt.tokens import RefreshToken


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

            response = create_or_resend_otp(email)
            if 'error' in response:
                return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(response, status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class TutorVerifyEmailView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        try:
            verification = TutorOTPVerification.objects.filter(email=email, otp=otp).latest('created_at')
        except TutorOTPVerification.DoesNotExist:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        if verification.created_at < timezone.now() - timedelta(minutes=5):
            return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)
        
        tutor_data = request.data.get('tutor_data', {})
        print(tutor_data)
        if not tutor_data:
            return Response({"error": "User data not provided"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            firstname = tutor_data.get('firstname')
            lastname = tutor_data.get('lastname')
            password = tutor_data.get('password')

            if not firstname or not lastname or not email or not password:
                return Response({"error": "All fields required"}, status=HTTP_400_BAD_REQUEST)

            Tutor.objects.create_tutor(
                firstname=firstname,
                lastname=lastname,
                email=email,
                password=password,
            )
            
            TutorOTPVerification.objects.filter(email=email).delete()
            return Response({"message": "Email verified and tutor created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": "Tutor creation failed. Pleace try again."}, status=HTTP_400_BAD_REQUEST)
        
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
            user = Tutor.objects.get(email=email)
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'message': 'Login successful'
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
        except Tutor.DoesNotExist:
            return Response({'error': 'Tutor does not exist'}, status=status.HTTP_401_UNAUTHORIZED)