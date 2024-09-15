from django.shortcuts import render
from rest_framework import generics, status
from tutor.models import Tutor, TutorDetails
from .serializers import TutorDetailsSerializer, StudentListSerializer, TutorListSerializer,TutorRequestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import UpdateAPIView
from django.utils import timezone


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
    def get(self, request):
        permission_classes = [IsAuthenticated] 
        student = User.objects.filter(user_type='student')
        serializer = StudentListSerializer(student, many=True)
        return Response(serializer.data)

# Admin Tutor List
class ApprovedTutorListView(APIView):
    def get(self, request):
        permission_classes = [IsAuthenticated]
        tutor = User.objects.filter(user_type='tutor',
        tutor_profile__tutordetails__admin_approved=True)
        serializer = TutorListSerializer(tutor, many=True)
        return Response(serializer.data)
    

class TutorApprovalView(generics.ListAPIView):
    queryset = TutorDetails.objects.all()
    serializer_class = TutorDetailsSerializer

class TutorRequests(APIView):
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated

    def get(self, request):
        tutors = User.objects.filter(user_type='tutor') 
        serializer = TutorRequestSerializer(tutors, many=True) 
        return Response(serializer.data)

from django.shortcuts import get_object_or_404

class TutorRequestDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tutor_id):
        tutor = get_object_or_404(Tutor, user_id=tutor_id)
        tutor_details =  tutor_details = TutorDetails.objects.get(tutor=tutor)
        serializer = TutorDetailsSerializer(tutor_details)
        return Response(serializer.data)


# Tutor Approval
class TutorApprovalUpdateView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = TutorDetails.objects.all()
    serializer_class = TutorDetailsSerializer
    lookup_field = 'id'

    def get_object(self):
        # Use 'tutorId' from the URL to get the object
        tutor_id = self.kwargs.get('tutorId')
        return TutorDetails.objects.get(id=tutor_id)

    def patch(self, request, *args, **kwargs):
        tutor_detail = self.get_object()
    
        
        if 'admin_approved' in request.data:
            tutor_detail.admin_approved = request.data['admin_approved']
            tutor_detail.approval_date = timezone.now() if tutor_detail.admin_approved else None
            tutor_detail.save()
            serializer = self.get_serializer(tutor_detail)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
