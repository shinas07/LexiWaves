from rest_framework import serializers
from .models import Tutor


class TutorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Tutor
        fields = ['email', 'firstname', 'lastname', 'password']

    def create(self, validated_data):
        return Tutor.objects.create_tutor(**validated_data)
    

