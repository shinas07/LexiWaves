from rest_framework import serializers
from .models import UserLesson, StudyStreak, StudyActivity,Certificate
from accounts.models import User
from tutor.models import TutorDetails,Tutor



class UserLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLesson
        fields = ['user','lesson','watched','watched_at']

class TutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email','first_name','profile_image']

class TutorDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorDetails
        fields = '__all__'
class TutorSerializer(serializers.ModelSerializer):
    details = TutorDetailsSerializer(source='tutordetails', read_only=True)
    user = TutorSerializer(read_only=True)

    class Meta:
        model = Tutor
        fields = '__all__'
    
class TutorProfileShowingSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorDetails
        fields = '__all__'

# Intraction With Tutor Serializer
class TutorInteractionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'profile_image']

class StudeyActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyActivity
        fields = ['id', 'course', 'watch_duration', 'watched_date', 'created_at']

class StreakSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name',read_only=True)
    class Meta:
        model = StudyStreak
        fields = ['user','first_name','current_streak', 'max_streak', 'last_study_date','total_study_days']

class certificateSerializer(serializers.ModelSerializer):
   student_name = serializers.SerializerMethodField()
   course_title = serializers.SerializerMethodField()
   tutor_name = serializers.SerializerMethodField()
   completion_date = serializers.SerializerMethodField()
   
   class Meta:
       model = Certificate
       fields = [
           'certificate_id', 'student_name', 'course_title', 
           'tutor_name', 'completion_date'
       ]
   
   def get_student_name(self, obj):
       return f"{obj.user.first_name} {obj.user.last_name}"
   
   def get_course_title(self, obj):
       return obj.course.title
   
   def get_tutor_name(self, obj):
       return f"{obj.course.tutor.first_name} {obj.course.tutor.last_name}"
   
   def get_completion_date(self, obj):
       return obj.issue_date.strftime("%B %d, %Y")