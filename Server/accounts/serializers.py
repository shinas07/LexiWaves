from rest_framework import serializers
# from .models import User,CourseReview
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from tutor.models import Course, Lesson
from lexi_admin.models import StudentCourseEnrollment

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'user_type', 'date_joined']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'user_type': {'required': True}
        }



    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class StudentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    tutor_name = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'description',
            'category',
            'thumbnail_url',
            'video_url',
            'price',
            'duration',
            'difficulty',
            'tutor_name',
            'created_at',
            'updated_at'
        ]

    def get_tutor_name(self, obj):
        return obj.tutor.get_full_name() if obj.tutor.get_full_name() else obj.tutor.username
    

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'lesson_video_url', 'order']

class CourseDetailSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    class Meta:
        model = Course
        fields = '__all__'

# User Enrolled Serializer
class StudentCourseEnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer()  # Use the CourseSerializer to serialize course details

    class Meta:
        model = StudentCourseEnrollment
        fields = ['id', 'course', 'payment_status', 'amount_paid', 'created_at']  # Include relevant field


# User Crouse Watch 
class CourseWatchSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)  # Nesting the LessonSerializer

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'category', 'thumbnail_url', 
                  'video_url', 'price', 'duration', 'difficulty', 'tutor', 
                  'created_at', 'updated_at', 'is_approved', 'lessons']

   #User profile serializer 
class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'user_type', 'date_joined','profile_image']
  

        
class UserProfileImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['profile_image']

# Review 
# class CourseReviewSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CourseReview
#         fields = ['id', 'user', 'course', 'rating', 'comment', 'created_at']
#         read_only_fields = ['user', 'course', 'created_at']