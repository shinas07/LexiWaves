from django.shortcuts import render
from tutor.models import Course
from rest_framework.response import Response
from rest_framework import status,generics
from accounts.serializers import CourseSerializer
# Create your views here.


#Home Page Latest courses
class LatestCoursesView(generics.ListAPIView):
    def get(self, request, *args, **kwargs):
        courses  = Course.objects.filter(is_approved=True)
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)