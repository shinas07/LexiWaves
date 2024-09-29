from rest_framework import serializers
from .models import Tutor, TutorDetails, Course
from accounts.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Lesson
from lexi_admin.models import StudentCourseEnrollment
from accounts.serializers import UserSerializer

class TutorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password','user_type']

    def create(self, validated_data):
        password = validated_data.pop('password') 
        user = User(**validated_data)  
        user.set_password(password)  
        user.save()  
        return user

class TutorDetailsSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)
    teaching_license = serializers.FileField(required=False)
    identity_proof = serializers.FileField(required=False)

    class Meta:
        model = TutorDetails
        exclude = ['tutor']

    def create(self, validated_data):
        # Extract the optional file fields
        profile_picture = validated_data.pop('profile_picture', None)
        teaching_license = validated_data.pop('teaching_license', None)
        identity_proof = validated_data.pop('identity_proof', None)

        user = self.context['request'].user

        if hasattr(user, 'tutor_profile'):
            tutor = user.tutor_profile
        else:
            raise ValueError("User does not have a tutor profile")

        # Create the tutor details instance without the files first
        tutor_details = TutorDetails.objects.create(tutor=tutor, **validated_data)
        print('tutor created',tutor_details)

        # Handle the file uploads if they exist
        if profile_picture:
            tutor_details.profile_picture = profile_picture
        if teaching_license:
            tutor_details.teaching_license = teaching_license
        if identity_proof:
            tutor_details.identity_proof = identity_proof

        # Save the changes
        tutor_details.save()
        return tutor_details

    
class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'lesson_video_url', 'order']




class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, required=False)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'category', 'thumbnail_url', 'video_url', 'price', 'duration', 'difficulty', 'tutor', 'created_at', 'updated_at', 'lessons']
        read_only_fields = ['tutor', 'created_at', 'updated_at']

    def create(self, validated_data):
        print('validated_data',validated_data)
        lessons_data = validated_data.pop('lessons', [])
        validated_data['tutor'] = self.context['request'].user
        course = Course.objects.create(**validated_data)
        
        for lesson_data in lessons_data:
            print(lesson_data)
            Lesson.objects.create(course=course, **lesson_data)
        
        return course



# Student Enrolled CoursesList
class CourseWithStudentsSerializer(serializers.ModelSerializer):
    enrolled_students = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'category', 'thumbnail_url', 'video_url', 'price', 'duration', 'difficulty', 'enrolled_students']

    def get_enrolled_students(self, course):
        enrollments = StudentCourseEnrollment.objects.filter(course=course)
        users = [enrollment.user for enrollment in enrollments]
        return UserSerializer(users, many=True).data


# class CourseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Course
#         fields = ['id', 'title', 'description', 'category', 'thumbnail_url', 'video_url', 'price', 'duration', 'difficulty', 'tutor', 'created_at', 'updated_at']
#         read_only_fields = ['tutor', 'created_at', 'updated_at']

#     def create(self, validated_data):
#         validated_data['tutor'] = self.context['request'].user
#         return super().create(validated_data)