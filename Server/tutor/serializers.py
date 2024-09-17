from rest_framework import serializers
from .models import Tutor, TutorDetails
from accounts.models import User
from django.contrib.auth.password_validation import validate_password

class TutorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password','user_type']

    def create(self, validated_data):
        password = validated_data.pop('password') 
        user = User(**validated_data)  
        user.set_password(password)  
        user.save()  
        return user
    

class TutorDetailsSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)
    teaching_license = serializers.FileField(required=False)
    identity_proof = serializers.FileField(required=False)
    

    class Meta:
        model = TutorDetails
        exclude = ['tutor']


    def create(self, validated_data):
        # Check if profile_picture, teaching_license, or identity_proof are present in the request
        profile_picture = validated_data.pop('profile_picture', None)
        teaching_license = validated_data.pop('teaching_license', None)
        identity_proof = validated_data.pop('identity_proof', None)

        user = self.context['request'].user

        print('user',user)
        if hasattr(user, 'tutor_profile'):
            tutor = user.tutor_profile
        else:
            raise ValueError("User does not have a tutor profile")
    
        print('tutor', tutor)

        tutor_details = TutorDetails.objects.create(tutor=tutor, **validated_data)

        # Handle the file uploads
        if profile_picture:
            tutor_details.profile_picture = profile_picture
        if teaching_license:
            tutor_details.teaching_license = teaching_license
        if identity_proof:
            tutor_details.identity_proof = identity_proof

        tutor_details.save()
        return tutor_details




