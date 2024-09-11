from rest_framework import status,generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import StudentUserSerializer, StudentListSerializer
from .models import StudentUser, OTPVerification
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


# def send_otp_email(email, otp):
#     subject = 'Verify you email'
#     html_message = render_to_string('email_template.html', {'otp': otp})
#     plain_message = strip_tags(html_message)
#     from_email = settings.EMAIL_HOST_USER
#     recipient_list = [email]

#     try:
#         send_mail(subject,plain_message, from_email, recipient_list,  html_message=html_message, fail_silently=False)
#         return True
#     except Exception as e:
#         print(f"error sending email': {str(e)}")
#         return False



# Otp Creation
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
        serializer = StudentUserSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']

            response = create_or_resend_otp(email)
            if 'error' in response:
                return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class VerifyEmailView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        try:
            verification = OTPVerification.objects.filter(email=email, otp=otp).latest('created_at')
            print(verification)
        except OTPVerification.DoesNotExist:
            print("problem")
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        if verification.created_at < timezone.now() - timedelta(minutes=5):
            print('ssss')
            return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)
        
        user_data = request.data.get('user_data', {})
        print(user_data)
        if not user_data:
            return Response({"error": "User data not provided"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user_data = request.data.get('user_data', {})
            email = request.data.get('email')
            firstname = user_data.get('first_name')
            lastname = user_data.get('last_name')
            password = user_data.get('password')

            if not firstname or not lastname or not email or not password:
                return Response({"error": "All fields required"}, status=HTTP_400_BAD_REQUEST)

            StudentUser.objects.create_user(
                first_name=firstname,
                last_name=lastname,
                email=email,
                password=password,
            )
            
            OTPVerification.objects.filter(email=email).delete()
            return Response({"message": "Email verified and user created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error: {str(e)}")
            return Response({"error": str(e)}, status=HTTP_400_BAD_REQUEST)
        

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
        print(email)
        print(password)
        # Authenticate user
       
        try:
            user = StudentUser.objects.get(email=email)
            print('user', user)
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
        except StudentUser.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_401_UNAUTHORIZED)
        
# Admin Student List
class StudentListView(generics.ListAPIView):
    queryset = StudentUser.objects.all()
    serializer_class = StudentListSerializer



