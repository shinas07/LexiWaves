# # serializers.py
# serializers.py
from rest_framework import serializers
from accounts.models import User
from .models import ChatRoom
from rest_framework import serializers


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = '__all__'



class UserSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['first_name', 'last_name','email','username']

    def get_username(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()  # Combine first and last names
