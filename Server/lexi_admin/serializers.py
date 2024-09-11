from rest_framework import serializers
from tutor.models import TutorDetails

class TutorDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorDetails
        fields = '__all__'
