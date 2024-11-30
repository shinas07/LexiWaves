from rest_framework import serializers
from .models import UserLesson, StudyStreak, StudyActivity
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

