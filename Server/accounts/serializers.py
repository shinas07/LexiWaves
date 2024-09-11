from rest_framework import serializers
from .models import StudentUser


class StudentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentUser
        fields = ['first_name', 'last_name', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }


class StudentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentUser
        fields = '__all__'