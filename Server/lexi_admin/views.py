from django.shortcuts import render
from rest_framework import generics, status
from tutor.models import Tutor, TutorDetails
from .serializers import TutorDetailsSerializer, StudentListSerializer, TutorListSerializer, TutorRequestSerializer, StudentCourseEnrollmentListSerializer,LanguageSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import UpdateAPIView
from django.utils import timezone
from .models import Language
from rest_framework import viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from tutor.models import Course
from .models import StudentCourseEnrollment

# Create your views here.


class AdminLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        print('email and password',email,password)

        if not email or not password:
            return Response({'error': "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate user
        admin = authenticate(request, email=email, password=password)
        
        if admin and admin.is_staff:
            # Generate tokens
            refresh = RefreshToken.for_user(admin)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials or not a staff user"}, status=status.HTTP_401_UNAUTHORIZED)


class StudentListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        student = User.objects.filter(user_type='student')
        serializer = StudentListSerializer(student, many=True)
        return Response(serializer.data)
    
# Student Block
class BlockUserView(APIView):
    def post(self, request, studentId):
        print(f"Received request data: {request.data}")  # For debugging
        try:
            # Retrieve the user using the studentId from the URL
            user = User.objects.get(id=studentId)
            user.is_active = False  # or set a custom field for blocking
            user.save()

            return Response({"message": "User blocked successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
# Admin Tutor List
class ApprovedTutorListView(APIView):
    permission_classes = [IsAuthenticated]


    def get(self, request):
        tutor = User.objects.filter(user_type='tutor',
        tutor_profile__tutordetails__admin_approved=True)
        serializer = TutorListSerializer(tutor, many=True)
        return Response(serializer.data)
    


class TutorApprovalView(generics.ListAPIView):
    queryset = TutorDetails.objects.all()
    serializer_class = TutorDetailsSerializer

#Admin Tutor request List View
class TutorRequests(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request):
        tutors = User.objects.filter(user_type='tutor', tutor_profile__tutordetails__admin_approved=False) 
        serializer = TutorRequestSerializer(tutors, many=True) 
        return Response(serializer.data)



class TutorRequestDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tutor_id):
        tutor = get_object_or_404(Tutor, user_id=tutor_id)
        tutor_details =  tutor_details = TutorDetails.objects.get(tutor=tutor)
        serializer = TutorDetailsSerializer(tutor_details)
        return Response(serializer.data)


class TutorApprovalUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, tutor_id):
        try:
            tutor = Tutor.objects.get(user__id=tutor_id)
            tutor_details = TutorDetails.objects.get(tutor=tutor)

            if tutor_details.admin_approved:
                return Response({"message": "Tutor is already approved."}, status=status.HTTP_400_BAD_REQUEST)

            approval_status = request.data.get('admin_approved', True)
            tutor_details.admin_approved = approval_status
            tutor_details.approval_date = timezone.now()
            tutor_details.save()
            return Response({"message": "Tutor approval updated successfully."}, status=status.HTTP_200_OK)
        except TutorDetails.DoesNotExist:
            return Response({"message": "Tutor details not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
    
            return Response({"message": "An error occurred while updating tutor approval."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class LanguageCreateView(APIView):
    authentication_classes = [JWTAuthentication] 
    def get(self, request, *args, **kwargs):
        languages = Language.objects.all()          
        print(languages)
        serializer = LanguageSerializer(languages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    def post(self, request, *args, **kwargs):
        serializer = LanguageSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

# Listing Enrolled Courses and Student

class EnrolledCoursesListView(generics.ListAPIView):
    queryset = StudentCourseEnrollment.objects.select_related('user', 'course').all()
    serializer_class = StudentCourseEnrollmentListSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Call the superclass method to get the response
        response = super().get(request, *args, **kwargs)
        print(response)
        return response  # This will return the serialized data as a JSON response

