from rest_framework import serializers
from .models import Tutor, TutorDetails


class TutorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Tutor
        fields = ['email', 'firstname', 'lastname', 'password']

    def create(self, validated_data):
        return Tutor.objects.create_tutor(**validated_data)
    


from django.contrib.auth import authenticate


class TutorLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        # Check if email and password are provided
        if not email or not password:
            raise serializers.ValidationError('Email and password are required.')

        # Authenticate the user
        tutor = authenticate(email=email, password=password)
        if tutor is None:
            raise serializers.ValidationError('Invalid email or password.')

        return {
            'tutor': tutor,
            'email': email,
            'password': password
        }








class TutorDetailsSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)
    teaching_license = serializers.FileField(required=False)
    identity_proof = serializers.FileField(required=False)
    

    class Meta:
        model = TutorDetails
        fields = [
            'profile_picture',
            'phone_number',
            'address',
            'biography',
            'degrees',
            'certifications',
            'educational_institutions',
            'relevant_courses',
            'work_history',
            'current_position',
            'teaching_experience',
            'subjects_offered',
            'skill_levels',
            'teaching_license',
            'hourly_rate',
            'payment_methods',
            'personal_statement',
            'identity_proof',
            'terms_of_service',
            'privacy_policy',
            'admin_approved',
            'approval_date',
            'created_at',
        ]

    def create(self, validated_data):
        # Check if profile_picture, teaching_license, or identity_proof are present in the request
        profile_picture = validated_data.pop('profile_picture', None)
        teaching_license = validated_data.pop('teaching_license', None)
        identity_proof = validated_data.pop('identity_proof', None)

        # request = self.context.get('request')
        # tutor = request.user.tutor

        tutor_details = TutorDetails.objects.create(**validated_data)

        # Handle the file uploads
        if profile_picture:
            tutor_details.profile_picture = profile_picture
        if teaching_license:
            tutor_details.teaching_license = teaching_license
        if identity_proof:
            tutor_details.identity_proof = identity_proof

        tutor_details.save()
        return tutor_details


# class TutorDetailsSerializer(serializers.ModelSerializer):
#     tutor = TutorSerializer(read_only=True)
#     class Meta:
#         model = TutorDetails
#         fields = '__all__'

#     def __init__(self, *args, **kwargs):
#         self.request = kwargs.pop('request', None)
#         super().__init__(*args, **kwargs)
#         self.fields['profile_picture'].required = False
#         self.fields['teaching_license'].required = False
#         self.fields['identity_proof'].required = False

#     def create(self, validated_data):
#         profile_picture = self.request.FILES.get('profile_picture', None)
#         teaching_license = self.request.FILES.get('teaching_license', None)
#         identity_proof = self.request.FILES.get('identity_proof', None)
#         print("Files received:", self.request.FILES)
#         try:
#             tutor = self.request.user.tutor
#             print(tutor)
#         except AttributeError:
#             print("Error: User does not have an associated tutor profile.")
#             raise serializers.ValidationError("User does not have an associated tutor profile.")

#         tutor_details = TutorDetails.objects.create(
#             tutor=tutor,
#             profile_picture=profile_picture,
#             teaching_license=teaching_license,
#             identity_proof=identity_proof,
#             **validated_data
#         )

#         return tutor_details


class TutorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tutor
        fields = '__all__'
        