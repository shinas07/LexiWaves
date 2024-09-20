from rest_framework import serializers
from tutor.models import TutorDetails 
from accounts.models import User
from .models import Language


class StudentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class TutorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        
# class TutorDetailsListSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TutorDetails
#         fields = '__all__'


# Tutor Details for request approval
class TutorDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorDetails
        fields = '__all__'

class TutorDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorDetails
        fields = '__all__'

class TutorRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'
