from django.shortcuts import render
from rest_framework import generics
from tutor.models import TutorDetails
from .serializers import TutorDetailsSerializer

# Create your views here.

class TutorApprovalView(generics.ListAPIView):
    queryset = TutorDetails.objects.all()
    serializer_class = TutorDetailsSerializer