from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)
    confirm_password = serializers.CharField(write_only = True)

    class Meta:
        model = CustomUser
        fields =  ['id', 'first_name', 'last_name', 'email', 'password', 'confirm_password']

        def validata(self, data):
            if CustomUser.objects.filter(email=data['email']).exists():
                raise serializers.ValidationError('Email already exists')
            return data
        
        
