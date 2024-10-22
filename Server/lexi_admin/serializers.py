from rest_framework import serializers
from tutor.models import TutorDetails 
from accounts.models import User
from .models import Language, StudentCourseEnrollment
from tutor.models import Course


class StudentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'




class TutorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        


# Tutor Details for request approval
class TutorDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorDetails
        fields = '__all__'

class TutorDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorDetails
        fields = '__all__'

class TutorRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'



class StudentCourseEnrollmentListSerializer(serializers.ModelSerializer):
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_category = serializers.CharField(source='course.category', read_only=True)
    course_tutor_name = serializers.CharField(source='course.tutor.first_name', read_only=True)
    course_tutor_last_name = serializers.CharField(source='course.tutor.last_name', read_only=True)  # 

    class Meta:
        model = StudentCourseEnrollment
        fields = [ 'id','user_first_name', 'user_last_name', 'course_title', 'course_category','course_tutor_name', 'course_tutor_last_name', 'payment_status', 'amount_paid','created_at',]


class ApprovedCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'category', 'price', 'duration']