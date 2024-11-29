from rest_framework import serializers
from lexi_admin.models import StudentCourseEnrollment
from .models import ClassChatRoom,ClassChatMessage
from rest_framework import serializers
from accounts.models import User

class TutorStudentListSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='user.first_name')
    student_email = serializers.CharField(source='user.email')
    course_name = serializers.CharField(source='course.title')
    enrollment_date = serializers.DateTimeField(source='created_at')
    amount_paid = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = StudentCourseEnrollment
        fields = [
            'id',
            'student_name',
            'student_email',
            'course_name',
            'enrollment_date',
            'amount_paid',
        ]

class SimpleChatBoxSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='user.first_name')

    class Meta:
        model = ClassChatRoom
        fields = ['id', 'room_id', 'student_name', 'created_at']

# Tutor Message Serializers
class UserBasicSerializer(serializers.ModelSerializer):
    avatar_letter = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'email', 'avatar_letter']

    def get_avatar_letter(self, obj):
        return obj.first_name[0].upper() if obj.first_name else '?'

class ChatMessageSerializer(serializers.ModelSerializer):
    is_tutor = serializers.SerializerMethodField()
    user_name = serializers.CharField(source='user.first_name')
    user_avatar = serializers.SerializerMethodField()

    class Meta:
        model = ClassChatMessage
        fields = ['id', 'content', 'timestamp', 'is_tutor', 'user_name', 'user_avatar']

    def get_is_tutor(self, obj):
        return obj.user == obj.room.tutor

    def get_user_avatar(self, obj):
        return obj.user.first_name[0].upper() if obj.user.first_name else '?'

class ChatRoomDetailSerializer(serializers.ModelSerializer):
    student = UserBasicSerializer(source='user')
    messages = ChatMessageSerializer(many=True, read_only=True)
    course_name = serializers.CharField(source='course.title', default='Course Discussion')

    class Meta:
        model = ClassChatRoom
        fields = ['room_id', 'student', 'course_name', 'messages']