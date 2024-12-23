from rest_framework import serializers
from .models import Tutor, TutorDetails, Course
from accounts.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Lesson, LessonCompletion,Answer, Question, QuizAttempt,TutorSlot
from lexi_admin.models import StudentCourseEnrollment
from accounts.serializers import UserSerializer
from lexi_admin.models import StudentCourseEnrollment

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
    identity_proof = serializers.FileField(required=False)

    class Meta:
        model = TutorDetails
        exclude = ['tutor']

    def create(self, validated_data):
        # Extract the optional file fields
        profile_picture = validated_data.pop('profile_picture', None)
        identity_proof = validated_data.pop('identity_proof', None)

        user = self.context['request'].user

        if hasattr(user, 'tutor_profile'):
            tutor = user.tutor_profile
        else:
            raise ValueError("User does not have a tutor profile")
        
        tutor_details = TutorDetails.objects.create(tutor=tutor, **validated_data)

        # Handle the file uploads if they exist
        if profile_picture:
            tutor_details.profile_picture = profile_picture
        if identity_proof:
            tutor_details.identity_proof = identity_proof

        tutor_details.save()
        return tutor_details
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile_image', 'user_type']
    
class TutorAllDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorDetails
        fields = [
            'profile_picture', 'phone_number', 'address', 'biography', 
            'degrees', 'educational_institutions', 'hourly_rate', 'subjects_offered'
        ] 

class TutorProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()
    detials = TutorAllDetailsSerializer(source='tutordetails')
    class Meta:
        model = Tutor
        fields = ['id','user','detials']

    
class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'lesson_video_url', 'order']

class LessonCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonCompletion
        fields = ['lesson', 'completed_at']

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, required=False)

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'category', 
            'thumbnail_url', 'video_url', 'price', 
            'duration', 'difficulty', 'tutor', 
            'created_at', 'updated_at', 'lessons',
        ]
        read_only_fields = ['tutor', 'created_at', 'updated_at']


    def create(self, validated_data):
        lessons_data = validated_data.pop('lessons', [])
        validated_data['tutor'] = self.context['request'].user
        course = Course.objects.create(**validated_data)
        
        for lesson_data in lessons_data:
            Lesson.objects.create(course=course, **lesson_data)
        
        return course
    
class CourseUpdateSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True)  # Many-to-many relationship, so 'many=True'

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'thumbnail_url', 'difficulty', 'price', 'lessons']

    def update(self, instance, validated_data):
        lessons_data = validated_data.pop('lessons', [])
        
        # Update the course fields (title, description, etc.)
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.thumbnail_url = validated_data.get('thumbnail_url', instance.thumbnail_url)
        instance.difficulty = validated_data.get('difficulty', instance.difficulty)
        instance.price = validated_data.get('price', instance.price)

        # Save the updated course
        instance.save()

        # # Update or create lessons for the course
        # for lesson_data in lessons_data:
        #     lesson_id = lesson_data.get('id')
        #     lesson_instance = Lesson.objects.get(id=lesson_id, course=instance)  # Fetch the lesson by ID

        #     # Update the lesson fields
        #     lesson_instance.title = lesson_data.get('title', lesson_instance.title)
        #     lesson_instance.description = lesson_data.get('description', lesson_instance.description)
        #     lesson_instance.lesson_video_url = lesson_data.get('lesson_video_url', lesson_instance.lesson_video_url)
        #     lesson_instance.order = lesson_data.get('order', lesson_instance.order)

        #     lesson_instance.save()  # Save the updated lesson

        return instance



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



# Quiz Part
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text']

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'answers']

# class QuizAttemptSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = QuizAttempt
#         fields = ['id', 'score', 'passed', 'date_attempted']

class CourseDetailSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = Course
        fields =  ['id', 'title', 'description', 'category', 'thumbnail_url', 'video_url', 'price', 'duration', 'difficulty', 'tutor', 'lessons', 'questions']


class TutorSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorSlot
        fields = ['id', 'date', 'start_time', 'end_time', 'hourly_rate']

# Tutor Couser List Serializer
class TutorCourseListSerializer(serializers.ModelSerializer):
    students_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'students_count', 'is_approved', 'price']
        read_only_fields = ['students_count', 'is_approved']

    def get_students_count(self, obj):
      
        return StudentCourseEnrollment.objects.filter(
            course=obj,
            payment_status='completed'
        ).count()