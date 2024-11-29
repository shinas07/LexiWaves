from rest_framework import serializers
from .models import VideoCallRequest

# class VideoCallRequestSerializer(serializers.ModelSerializer):
#     student_name = serializers.CharField(source='student.user.first_name', read_only=True)
#     tutor_name = serializers.CharField(source='tutor.user_first_name', read_only=True)
#     course_name = serializers.CharField(source='course.title', read_only=True)

#     class Meta:
#         model = VideoCallRequest
#         fields = [
#             'id', 'student', 'tutor', 'course',
#             'student_name', 'tutor_name', 'course_name',
#             'status', 'created_at'
#         ]
#         read_only_fields = ['status', 'created_at']

class VideoCallRequestSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title',read_only=True)
    class Meta:
        model = VideoCallRequest
        fields = ['id','student','tutor','course','status','created_at','course_title','scheduled_time']

    